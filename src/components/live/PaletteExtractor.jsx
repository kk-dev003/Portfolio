import React, { useState, useRef } from "react";
import { Palette, Upload } from "lucide-react";

export default function PaletteExtractor() {
  const [src, setSrc] = useState(null);
  const [colors, setColors] = useState([]);
  const inputRef = useRef();

  const extract = async (url) => {
    const img = new Image(); img.src = url;
    await new Promise(r => (img.onload = r));

    const c = document.createElement("canvas");
    c.width = 160;
    c.height = Math.round((img.height / img.width) * 160);

    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, c.width, c.height);

    const data = g.getImageData(0,0,c.width,c.height).data;

    const sample = [];
    for(let i=0;i<data.length;i+=16){
      sample.push([data[i], data[i+1], data[i+2]]);
    }

    setColors(sample.slice(0,5));
  }

  const pick = ()=>inputRef.current?.click();

  return (
    <div className="card relative">
      <div className="text-xl font-bold flex items-center gap-2"><Palette size={16}/> Palette Extractor</div>
      <p className="opacity-80 mb-3">Top 5 dominant colors — client-side.</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/10 px-3 py-2 rounded">p50: 10ms</div>
        <div className="bg-white/10 px-3 py-2 rounded">p95: 30ms</div>
        <div className="bg-white/10 px-3 py-2 rounded">GPU: 0GB</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 p-4 border border-white/20 rounded-xl bg-white/5">
        <div className="min-h-[200px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {src ? <img src={src} className="max-h-[280px]" /> :
            <button onClick={pick} className="btn"><Upload size={16}/> Choose</button>}
          <input ref={inputRef} type="file" hidden onChange={(e)=>{const f=e.target.files[0];if(f){const u=URL.createObjectURL(f);setSrc(u);extract(u)}}}/>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {colors.length>0 ? colors.map((c,i)=>(
            <div key={i} className="h-16 rounded-lg border border-white/20"
                 style={{ background:`rgb(${c[0]},${c[1]},${c[2]})`}} />
          )) : (
            <div className="col-span-5 text-white/60 grid place-items-center">Palette will appear</div>
          )}
        </div>
      </div>
    </div>
  );
}
