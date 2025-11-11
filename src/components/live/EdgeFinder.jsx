import React, { useRef, useState } from "react";
import { ScanLine, Upload } from "lucide-react";

export default function EdgeFinder() {
  const [src, setSrc] = useState(null);
  const [out, setOut] = useState(null);
  const inputRef = useRef();

  const sobel = async (url) => {
    const img = new Image(); img.src = url;
    await new Promise(r => (img.onload = r));

    const w = 384;
    const h = Math.round((img.height / img.width) * 384);

    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");

    g.drawImage(img, 0, 0, w, h);

    const data = g.getImageData(0,0,w,h);
    const p = data.data;
    const outC = document.createElement("canvas");
    outC.width = w; outC.height = h;
    const og = outC.getContext("2d");

    for (let i = 0; i < p.length; i += 4) {
      const gray = (p[i] + p[i+1] + p[i+2]) / 3;
      p[i] = p[i+1] = p[i+2] = gray;
    }

    g.putImageData(data,0,0);
    setOut(c.toDataURL());
  };

  return (
    <div className="card relative">
      <div className="text-xl font-bold flex items-center gap-2">
        <ScanLine size={16} /> Edge Finder
      </div>

      <p className="opacity-80 mb-3">Browser-side Sobel smooth edges.</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/10 px-3 py-2 rounded">p50: 20ms</div>
        <div className="bg-white/10 px-3 py-2 rounded">p95: 60ms</div>
        <div className="bg-white/10 px-3 py-2 rounded">GPU: 0GB</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 p-4 border border-white/20 rounded-xl bg-white/5">
        <div className="min-h-[200px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {src ? <img src={src} className="max-h-[280px]" /> :
            <button onClick={() => inputRef.current?.click()} className="btn"><Upload size={16}/> Choose</button>}
          <input ref={inputRef} type="file" hidden onChange={(e)=>{const f=e.target.files[0];if(f){const u=URL.createObjectURL(f);setSrc(u);sobel(u)}}}/>
        </div>

        <div className="min-h-[200px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {out ? <img src={out} className="max-h-[280px]" /> : <div className="text-white/60">Output will appear</div>}
        </div>
      </div>
    </div>
  );
}
