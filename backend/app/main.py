import io, os
from typing import Tuple
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from PIL import Image, ImageOps, ImageFilter, ImageDraw

try:
    import onnxruntime as ort
    ORT = True
except Exception:
    ort = None
    ORT = False

APP_TITLE = "KK AI Backend"
MODEL_PATH = os.getenv("UNET_MODEL_PATH", "backend/models/unet_brain.onnx")

app = FastAPI(title=APP_TITLE, version="2.1")

class TextIn(BaseModel):
    text: str

AFINN = { "good":2,"great":3,"awesome":3,"love":3,"fast":2,"happy":2,"delight":2,"wow":2,
          "bad":-2,"slow":-2,"hate":-3,"bug":-2,"broken":-2,"terrible":-3,"sad":-2,"angry":-2 }
TOXIC = {"stupid","idiot","dumb","hate","trash","useless"}

def pil_bytes_png(img:Image.Image)->io.BytesIO:
    buf = io.BytesIO(); img.save(buf, format="PNG"); buf.seek(0); return buf

@app.get("/api/health")
def health():
    detail = {"status":"ok","onnx":ORT}
    if ORT:
        detail["providers"] = ort.get_available_providers()
        detail["model_found"] = os.path.exists(MODEL_PATH)
    return detail

@app.post("/api/sentiment")
def sentiment(inp:TextIn):
    clean = "".join(c if c.isalpha() else " " for c in inp.text.lower())
    score = sum(AFINN.get(w,0) for w in clean.split())
    return {"score":score}

@app.post("/api/toxicity")
def toxicity(inp:TextIn):
    t = inp.text.lower()
    hits = [k for k in TOXIC if k in t]
    return {"toxic":bool(hits),"hits":hits}

@app.post("/api/summarize")
def summarize(inp:TextIn):
    text = inp.text
    sents = [x.strip() for x in text.split(".") if x.strip()]
    freq = {}
    for w in "".join(c if c.isalpha() else " " for c in text.lower()).split():
        freq[w] = freq.get(w,0)+1
    scored = sorted(((sum(freq.get(w,0) for w in s.lower().split()), s) for s in sents), reverse=True)
    return {"summary": ". ".join(seg for _,seg in scored[:3])}

@app.post("/api/edge")
async def edge(image: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await image.read())).convert("L")
    img = ImageOps.autocontrast(img).resize((256,256))
    out = img.filter(ImageFilter.FIND_EDGES)
    return StreamingResponse(pil_bytes_png(out), media_type="image/png")

@app.post("/api/style")
async def style(image: UploadFile = File(...), style: str = Form("neon")):
    img = Image.open(io.BytesIO(await image.read())).convert("RGB").resize((256,256))
    if style=="neon":
        img = ImageOps.colorize(ImageOps.grayscale(img), black="#15012A", white="#00F5FF")
    elif style=="mono":
        img = ImageOps.grayscale(img).convert("RGB")
    else:
        img = ImageOps.colorize(ImageOps.grayscale(img), black="#3b1d0f", white="#ffd26a")
    return StreamingResponse(pil_bytes_png(img), media_type="image/png")

# ---- UNet
UNET = None; IN_NAME=None; OUT_NAME=None; H=256; W=256
def load_unet():
    global UNET, IN_NAME, OUT_NAME
    if UNET or not ORT or not os.path.exists(MODEL_PATH): return
    providers = ["CUDAExecutionProvider","CPUExecutionProvider"] if "CUDAExecutionProvider" in ort.get_available_providers() else ["CPUExecutionProvider"]
    UNET = ort.InferenceSession(MODEL_PATH, providers=providers)
    IN_NAME = UNET.get_inputs()[0].name
    OUT_NAME = UNET.get_outputs()[0].name

def prep(img:Image.Image)->np.ndarray:
    img = img.convert("RGB").resize((W,H))
    arr = np.asarray(img, dtype=np.float32)/255.0
    return np.transpose(arr,(2,0,1))[None,...]

def overlay(src:np.ndarray, mask:np.ndarray)->Image.Image:
    # src: HxWx3 uint8 ; mask: HxW {0,1}
    alpha = 0.45
    overlay = np.zeros_like(src, dtype=np.float32)
    overlay[...,0]=255; overlay[...,2]=255  # magenta
    srcf = src.astype(np.float32); m = mask.astype(np.float32)[...,None]
    out = (srcf*(1-alpha*m) + overlay*alpha*m).clip(0,255).astype(np.uint8)
    return Image.fromarray(out)

def stats(mask:np.ndarray):
    h,w = mask.shape; area = int(mask.sum()); area_pct = float(area)/float(h*w)*100.0
    ys,xs = np.where(mask>0)
    bbox = [0,0,0,0] if xs.size==0 else [int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]
    return area_pct, bbox

@app.post("/api/segment")
async def segment(image: UploadFile = File(...)):
    raw = await image.read()
    srcPIL = Image.open(io.BytesIO(raw)).convert("RGB").resize((W,H))
    src = np.array(srcPIL)

    load_unet()
    if UNET:
        pred = UNET.run([OUT_NAME], {IN_NAME: prep(srcPIL)})[0]
        if pred.ndim==4 and pred.shape[1]==1:
            prob = pred[0,0]; mask = (prob>0.5).astype(np.uint8)
        else:
            cls = np.argmax(pred,axis=1)[0]; mask = (cls>0).astype(np.uint8)
    else:
        g = np.array(ImageOps.grayscale(srcPIL), dtype=np.uint8)
        thr = np.clip(g.mean()+g.std()*0.8, 60, 220).astype(np.uint8)
        mask = (g>thr).astype(np.uint8)

    # area only (no bbox rendering)
    h,w = mask.shape
    area_pct = float(mask.sum()) / float(h*w) * 100.0

    # overlay magenta mask
    alpha = 0.45
    overlay = np.zeros_like(src, dtype=np.float32)
    overlay[...,0]=255; overlay[...,2]=255
    out = (src.astype(np.float32)*(1-alpha*mask[...,None]) + overlay*alpha*mask[...,None]).clip(0,255).astype(np.uint8)

    buf = io.BytesIO(); Image.fromarray(out).save(buf, format="PNG"); buf.seek(0)
    return StreamingResponse(buf, media_type="image/png", headers={"X-Mask-Area-Pct": f"{area_pct:.2f}"})
