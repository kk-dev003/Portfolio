import io, os, base64, time, json, datetime
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import onnxruntime as ort

MODEL_PATH = os.getenv("UNET_ONNX_PATH", "models/unet_brainseg.onnx")
providers = ["CUDAExecutionProvider", "CPUExecutionProvider"]
sess = ort.InferenceSession(MODEL_PATH, providers=providers)

# Assume UNet with 1x1x256x256, sigmoid output
def preprocess(img: Image.Image):
  img = img.convert("L").resize((256, 256))
  arr = np.array(img, dtype=np.float32) / 255.0
  arr = arr[None, None, :, :]
  return arr

def postprocess(raw):
  # raw is (1,1,256,256) float
  m = (raw[0, 0] > 0.5).astype(np.uint8) * 255
  return m  # ndarray (256,256) uint8

def bbox_from_mask(mask: np.ndarray):
  # returns (x,y,w,h) in mask pixel space or None
  ys, xs = np.where(mask == 255)
  if xs.size == 0 or ys.size == 0:
    return None
  x0, x1 = int(xs.min()), int(xs.max())
  y0, y1 = int(ys.min()), int(ys.max())
  return [x0, y0, int(x1 - x0 + 1), int(y1 - y0 + 1)]

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

class Health(BaseModel):
  model: str
  providers: list

@app.get("/health", response_model=Health)
def health():
  return Health(model=os.path.basename(MODEL_PATH), providers=sess.get_providers())

@app.post("/segment")
async def segment(file: UploadFile = File(...)):
  raw = await file.read()
  img = Image.open(io.BytesIO(raw))
  width, height = img.size

  x = preprocess(img)
  t0 = time.perf_counter()
  out = sess.run(None, {sess.get_inputs()[0].name: x})[0]
  latency_ms = (time.perf_counter() - t0) * 1000.0

  mask = postprocess(out)  # ndarray 256x256
  area_pct = round(100.0 * float((mask == 255).sum()) / (mask.size), 2)
  bbox = bbox_from_mask(mask)

  # Return mask as PNG base64
  pil_mask = Image.fromarray(mask)
  buf = io.BytesIO(); pil_mask.save(buf, format="PNG")
  b64 = base64.b64encode(buf.getvalue()).decode()

  return {
    "latency_ms": round(latency_ms, 2),
    "area_pct": area_pct,
    "bbox": bbox,              # [x,y,w,h] in 256x256 space, or null
    "mask_png_b64": "data:image/png;base64," + b64,
    "source_w": width,
    "source_h": height
  }

# ---------- Lightweight analytics sink ----------
LOG_PATH = os.getenv("ANALYTICS_LOG", "analytics.log")

@app.post("/analytics")
async def analytics(request: Request):
  try:
    payload = await request.json()
  except Exception:
    payload = {"_raw": (await request.body()).decode("utf-8", errors="ignore")}
  record = {
    "ts": datetime.datetime.utcnow().isoformat() + "Z",
    "ip": request.client.host if request.client else None,
    **payload
  }
  with open(LOG_PATH, "a", encoding="utf-8") as f:
    f.write(json.dumps(record, ensure_ascii=False) + "\n")
  return {"ok": True}
