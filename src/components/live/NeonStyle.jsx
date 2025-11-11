import React, { useRef, useState } from "react";
import { Upload, Zap, Cpu } from "lucide-react";

const DEFAULT_API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function BrainScan() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef();

  const pick = () => inputRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setBusy(true);

    try {
      const serverOn = localStorage.getItem("kk_server_on") === "1";
      if (!serverOn) throw new Error("Backend disabled");

      const fd = new FormData();
      fd.append("file", file);

      const t0 = performance.now();
      const res = await fetch(`${DEFAULT_API}/segment`, { method: "POST", body: fd });
      const j = await res.json();
      const rtt = Math.round(performance.now() - t0);

      setResult(j.mask_png_b64);
      setStats({ ...j, rtt });
    } catch (err) {
      setStats({ error: "Server OFF or unreachable." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card relative">
      <div className="text-xl font-bold flex items-center gap-2">
        <Cpu size={16} /> BrainScan — UNet Segmentation (LIVE)
      </div>
      <p className="opacity-80 mb-3">Upload MRI slice → get segmentation + bbox.</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/10 px-3 py-2 rounded">p50: {stats?.latency_ms || "…"}</div>
        <div className="bg-white/10 px-3 py-2 rounded">p95: —</div>
        <div className="bg-white/10 px-3 py-2 rounded">GPU: 2.4GB</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 p-4 border border-white/20 rounded-xl bg-white/5">
        <div className="min-h-[200px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {preview ? (
            <img src={preview} className="max-h-[280px]" />
          ) : (
            <button onClick={pick} className="btn"><Upload size={16}/> Choose</button>
          )}
          <input ref={inputRef} type="file" hidden onChange={onFile} />
        </div>

        <div className="min-h-[200px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {result ? (
            <img src={result} className="max-h-[280px]" />
          ) : (
            <div className="text-white/50">{busy ? "Processing…" : "Output will appear"}</div>
          )}
        </div>
      </div>

      <div className="text-xs text-white/60 mt-3 flex items-center gap-1">
        <Zap size={14}/> dev numbers — prod uses p50/p95 & SLOs
      </div>
    </div>
  );
}
