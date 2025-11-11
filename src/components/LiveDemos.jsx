import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload, Cpu, Zap, Wand2, ScanLine, Palette, Sparkles,
  Activity, Power, Link as LinkIcon, Image as ImageIcon
} from "lucide-react";

const DEFAULT_API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

/* ---------------- Shared UI bits ---------------- */
function KPI({ label, value }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm">
      <div className="opacity-70">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
function Doodle({ children }) {
  return <div className="absolute -right-2 -top-3 text-2xl opacity-70 select-none">{children}</div>;
}

// local no-op analytics to avoid imports breaking builds
const track = (_evt, _payload) => {};

/* Helper: fetch with timeout */
async function fetchWithTimeout(url, opts = {}, ms = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/* Inline compositor: base + mask + theme bbox */
async function composeWithBBox(previewUrl, maskPngB64, bbox, themeColor = "#00F5FF") {
  const img = new Image(); img.crossOrigin = "anonymous"; img.src = previewUrl;
  const msk = new Image(); msk.crossOrigin = "anonymous"; msk.src = maskPngB64;
  await Promise.all([new Promise(r => (img.onload = r)), new Promise(r => (msk.onload = r))]);

  const S = 512;
  const c = document.createElement("canvas"); c.width = S; c.height = S;
  const g = c.getContext("2d");

  g.drawImage(img, 0, 0, S, S);
  g.globalAlpha = 0.45; g.drawImage(msk, 0, 0, S, S); g.globalAlpha = 1;

  if (bbox && bbox.length === 4) {
    const [x, y, w, h] = bbox;
    g.lineWidth = 3;
    g.strokeStyle = themeColor;
    g.shadowColor = themeColor;
    g.shadowBlur = 10;
    g.strokeRect(x + 0.5, y + 0.5, w, h);
    g.shadowBlur = 0;
  }
  return c.toDataURL("image/png");
}

/* ---------------- Toolbar at top of Live Demos ---------------- */
function ServerToolbar() {
  const [apiBase, setApiBase] = useState(localStorage.getItem("kk_api") || DEFAULT_API);
  const [enabled, setEnabled] = useState(localStorage.getItem("kk_server_on") === "1");
  const [healthy, setHealthy] = useState(false);
  const [lastMsg, setLastMsg] = useState("");

  useEffect(() => { localStorage.setItem("kk_api", apiBase); }, [apiBase]);
  useEffect(() => { localStorage.setItem("kk_server_on", enabled ? "1" : "0"); }, [enabled]);

  useEffect(() => {
    const ping = async () => {
      if (!enabled) { setHealthy(false); setLastMsg("Off"); return; }
      try {
        // Try /health first, then /api/health
        const u1 = `${apiBase.replace(/\/+$/,"")}/health`;
        const u2 = `${apiBase.replace(/\/+$/,"")}/api/health`;
        let r = await fetchWithTimeout(u1, { cache: "no-store" });
        if (!r.ok) {
          const r2 = await fetchWithTimeout(u2, { cache: "no-store" });
          r = r2;
        }
        setHealthy(r.ok);
        setLastMsg(r.ok ? "Healthy" : `HTTP ${r.status}`);
      } catch (e) {
        setHealthy(false);
        setLastMsg("No response");
      }
    };
    ping();
    const id = setInterval(ping, 4000);
    return () => clearInterval(id);
  }, [apiBase, enabled]);

  const healthText = useMemo(() => (healthy ? "Healthy" : lastMsg || "No response"), [healthy, lastMsg]);

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setEnabled(v => !v)}
          className={`px-3 py-1.5 rounded-full border text-sm inline-flex items-center gap-1 transition
            ${enabled ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200" : "bg-white/5 border-white/15 text-white/80"}`}
          title="Toggle FastAPI backend"
        >
          <Power size={14} /> {enabled ? "Server On" : "Server Off"}
        </button>
        <div
          className={`px-2.5 py-1.5 rounded-full text-xs inline-flex items-center gap-1 border
            ${healthy ? "border-emerald-300/30 text-emerald-200" : "border-rose-300/30 text-rose-200"}`}
          title="Backend health"
        >
          <Activity size={12} /> {healthText}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LinkIcon size={14} className="opacity-70" />
        <input
          className="w-[260px] bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs"
          value={apiBase}
          onChange={(e) => setApiBase(e.target.value)}
          placeholder="http://127.0.0.1:8000"
        />
      </div>
    </div>
  );
}

/* ---------------- BrainScan (LIVE) ---------------- */
function BrainScan() {
  const [apiBase] = useState(localStorage.getItem("kk_api") || DEFAULT_API);
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
    track("brainscan_upload_start", { size: file.size });

    try {
      const serverOn = localStorage.getItem("kk_server_on") === "1";
      if (!serverOn) throw new Error("Backend disabled");

      const fd = new FormData();
      fd.append("file", file);
      const t0 = performance.now();
      const res = await fetch(`${apiBase.replace(/\/+$/,"")}/segment`, { method: "POST", body: fd });
      const j = await res.json();
      const rtt = Math.round(performance.now() - t0);

      const composed = await composeWithBBox(previewUrl, j.mask_png_b64, j.bbox, "#00F5FF");
      setResult(composed);
      setStats({ ...j, rtt_ms: rtt });
      track("brainscan_success", { latency_ms: j.latency_ms, area_pct: j.area_pct, rtt_ms: rtt });
    } catch (err) {
      setStats({ error: "Server is off or not reachable. Toggle it above and run FastAPI on :8000." });
      setResult(null);
      track("brainscan_error", { message: String(err) });
    } finally { setBusy(false); }
  };

  return (
    <div className="card relative">
      <Doodle>🧠</Doodle>
      <div className="text-xl font-bold flex items-center gap-2">
        <Cpu size={16} /> BrainScan — UNet Segmentation (LIVE)
      </div>
      <div className="opacity-90 -mt-1 mb-2">Upload an MRI slice. We overlay the mask and a theme-contrasting bbox.</div>

      <div className="grid grid-cols-3 gap-2 mb-1">
        <KPI label="p50" value={stats?.latency_ms ? `${stats.latency_ms}ms` : "…"} />
        <KPI label="p95" value="—" />
        <KPI label="GPU mem" value="~2.4GB" />
      </div>

      <div className="rounded-xl border border-dashed border-white/20 bg-white/4 p-4">
        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div className="min-h-[220px] rounded-lg bg-black/30 grid place-items-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="" className="max-h-[300px] object-contain" />
            ) : (
              <button onClick={pick} className="btn"><Upload size={16} /> Choose Image</button>
            )}
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
          </div>

          <div className="min-h-[220px] rounded-lg bg-black/30 grid place-items-center overflow-hidden">
            {result ? (
              <img src={result} alt="segmented" className="max-h-[300px] object-contain" />
            ) : (
              <div className="text-white/60">{busy ? "Summoning UNet… 🪄" : "Segmentation result will appear here"}</div>
            )}
          </div>
        </div>

        {stats?.error && <div className="mt-3 text-sm text-amber-300">{stats.error}</div>}
        {stats?.bbox && (
          <div className="mt-3 text-xs opacity-80">
            bbox [x,y,w,h]: [{stats.bbox.join(", ")}] • area {stats.area_pct}% • latency {stats.latency_ms}ms (RTT {stats.rtt_ms}ms)
          </div>
        )}

        <div className="mt-3 text-xs opacity-70 flex items-center gap-2">
          <Zap size={14} /> Dev figures on my machine™. In prod we track p50/p95 and error budgets per model version.
        </div>
      </div>
    </div>
  );
}

/* ---------------- Neon Style Transfer (client, with controls) ----------- */
function NeonStyleTransfer() {
  const [src, setSrc] = useState(null);
  const [out, setOut] = useState(null);
  const [hue, setHue] = useState(20);
  const [sat, setSat] = useState(1.25);
  const [bloom, setBloom] = useState(0.3);
  const [contrast, setContrast] = useState(1.1);
  const inputRef = useRef();

  const process = async (url) => {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = url;
    await new Promise((r) => (img.onload = r));
    const w = 512, h = Math.round((img.height / img.width) * 512);
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    g.filter = `contrast(${contrast}) saturate(${sat}) hue-rotate(${hue}deg)`;
    g.drawImage(img, 0, 0, w, h);

    if (bloom > 0) {
      const layer = document.createElement("canvas"); layer.width = w; layer.height = h;
      const lg = layer.getContext("2d");
      lg.drawImage(c, 0, 0);
      lg.globalCompositeOperation = "screen";
      lg.filter = `blur(${Math.round(6 * bloom)}px) brightness(${1 + bloom})`;
      lg.drawImage(c, 0, 0);
      g.globalCompositeOperation = "screen";
      g.drawImage(layer, 0, 0);
      g.globalCompositeOperation = "source-over";
    }
    setOut(c.toDataURL("image/png"));
  };

  useEffect(() => { if (src) process(src); }, [hue, sat, bloom, contrast]);

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f); setSrc(url); process(url);
  };

  return (
    <div className="card relative">
      <Doodle>🎨</Doodle>
      <div className="text-xl font-bold flex items-center gap-2">
        <Wand2 size={16} /> Neon Style Transfer (client)
      </div>
      <p className="opacity-90">Behance-style neon pastel — tweak hue, saturation, bloom & contrast.</p>

      <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
        <KPI label="p50" value="~22ms" />
        <KPI label="p95" value="~60ms" />
        <KPI label="GPU mem" value="0GB" />
      </div>

      <div className="rounded-xl border border-dashed border-white/20 bg-white/4 p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
            {src ? <img src={src} className="max-h-[300px] object-contain" /> :
              <button onClick={() => inputRef.current?.click()} className="btn"><Upload size={16} /> Choose Image</button>}
            <input ref={inputRef} hidden type="file" accept="image/*" onChange={onFile} />
          </div>

          <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
            {out ? <img src={out} className="max-h-[300px] object-contain" /> :
              <div className="text-white/60">Output will appear here</div>}
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 grid sm:grid-cols-4 gap-4 text-xs">
          <label className="grid gap-1">
            <span className="opacity-80">Hue {hue}°</span>
            <input type="range" min="-180" max="180" value={hue} onChange={(e)=>setHue(parseInt(e.target.value))}/>
          </label>
          <label className="grid gap-1">
            <span className="opacity-80">Saturation {sat.toFixed(2)}×</span>
            <input type="range" min="0.5" max="2" step="0.05" value={sat} onChange={(e)=>setSat(parseFloat(e.target.value))}/>
          </label>
          <label className="grid gap-1">
            <span className="opacity-80">Bloom {bloom.toFixed(2)}×</span>
            <input type="range" min="0" max="1" step="0.05" value={bloom} onChange={(e)=>setBloom(parseFloat(e.target.value))}/>
          </label>
          <label className="grid gap-1">
            <span className="opacity-80">Contrast {contrast.toFixed(2)}×</span>
            <input type="range" min="0.8" max="1.4" step="0.02" value={contrast} onChange={(e)=>setContrast(parseFloat(e.target.value))}/>
          </label>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Edge Finder (client) ---------------- */
function EdgeFinder() {
  const [src, setSrc] = useState(null);
  const [out, setOut] = useState(null);
  const inputRef = useRef();

  const sobel = async (url) => {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = url;
    await new Promise((r) => (img.onload = r));
    const w = 384, h = Math.round((img.height / img.width) * 384);
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    g.drawImage(img, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h); const p = d.data; const gray = new Uint8ClampedArray(w * h);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) gray[j] = (p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114) | 0;
    const gx = [-1,0,1,-2,0,2,-1,0,1], gy = [-1,-2,-1,0,0,0,1,2,1];
    const outd = new Uint8ClampedArray(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sx = 0, sy = 0, idx = y * w + x, k = 0;
        for (let yy = -1; yy <= 1; yy++) for (let xx = -1; xx <= 1; xx++, k++) {
          sx += gx[k] * gray[idx + yy * w + xx]; sy += gy[k] * gray[idx + yy * w + xx];
        }
        outd[idx] = Math.min(255, Math.hypot(sx, sy) | 0);
      }
    }
    const oc = document.createElement("canvas"); oc.width = w; oc.height = h; const og = oc.getContext("2d");
    const oimg = og.createImageData(w, h);
    for (let i = 0, j = 0; i < oimg.data.length; i += 4, j++) {
      const v = outd[j]; oimg.data[i]=v; oimg.data[i+1]=v; oimg.data[i+2]=v; oimg.data[i+3]=255;
    }
    og.putImageData(oimg, 0, 0);
    setOut(oc.toDataURL("image/png"));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f); setSrc(url); sobel(url);
  };

  return (
    <div className="card relative">
      <Doodle>🪄</Doodle>
      <div className="text-xl font-bold flex items-center gap-2"><ScanLine size={16} /> Edge Finder (client)</div>
      <p className="opacity-90">Edges so sharp they could cut build times.</p>

      <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
        <KPI label="p50" value="~40ms" />
        <KPI label="p95" value="~110ms" />
        <KPI label="GPU mem" value="0GB" />
      </div>

      <div className="rounded-xl border border-dashed border-white/20 bg-white/4 p-4 grid sm:grid-cols-2 gap-4">
        <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {src ? <img src={src} className="max-h-[300px] object-contain" /> :
            <button onClick={() => inputRef.current?.click()} className="btn"><Upload size={16} /> Choose Image</button>}
          <input ref={inputRef} hidden type="file" accept="image/*" onChange={onFile} />
        </div>
        <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {out ? <img src={out} className="max-h-[300px] object-contain" /> :
            <div className="text-white/60">Output will appear here</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Palette Extractor (client) ---------------- */
function PaletteExtractor() {
  const [src, setSrc] = useState(null);
  const [colors, setColors] = useState([]);
  const inputRef = useRef();

  const extract = async (url) => {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = url;
    await new Promise((r) => (img.onload = r));
    const w = 160, h = Math.max(1, Math.round((img.height / img.width) * 160));
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    g.drawImage(img, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h).data;
    const pts = [];
    for (let i = 0; i < d.length; i += 16) pts.push([d[i], d[i + 1], d[i + 2]]);
    const K = 5; let cent = pts.slice(0, K);
    for (let it = 0; it < 8; it++) {
      const buckets = Array.from({ length: K }, () => []);
      for (const p of pts) {
        let bi = 0, bd = 1e9;
        for (let k = 0; k < K; k++) {
          const c = cent[k];
          const dd = (p[0]-c[0])**2 + (p[1]-c[1])**2 + (p[2]-c[2])**2;
          if (dd < bd) { bd = dd; bi = k; }
        }
        buckets[bi].push(p);
      }
      for (let k = 0; k < K; k++) {
        if (!buckets[k].length) continue;
        const s = buckets[k].reduce((a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]], [0,0,0])
          .map((v) => Math.round(v / buckets[k].length));
        cent[k] = s;
      }
    }
    setColors(cent);
  };
  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f); setSrc(url); extract(url);
  };

  return (
    <div className="card relative">
      <Doodle>🎯</Doodle>
      <div className="text-xl font-bold flex items-center gap-2"><Palette size={16} /> Palette Extractor (client)</div>
      <p className="opacity-90">Top colors from any image for decks, theming, and design QA.</p>

      <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
        <KPI label="p50" value="~18ms" />
        <KPI label="p95" value="~45ms" />
        <KPI label="GPU mem" value="0GB" />
      </div>

      <div className="rounded-xl border border-dashed border-white/20 bg-white/4 p-4 grid sm:grid-cols-2 gap-4">
        <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {src ? <img src={src} className="max-h-[300px] object-contain" /> :
            <button onClick={() => inputRef.current?.click()} className="btn"><Upload size={16} /> Choose Image</button>}
          <input ref={inputRef} hidden type="file" accept="image/*" onChange={onFile} />
        </div>
        <div className="min-h-[220px] bg-black/30 rounded-lg p-4 grid grid-cols-5 gap-2">
          {colors.length
            ? colors.map((c, i) => (
                <div key={i} className="rounded-lg h-[64px] border border-white/10"
                     style={{ background: `rgb(${c[0]},${c[1]},${c[2]})` }} />
              ))
            : <div className="text-white/60 col-span-5 grid place-items-center">Palette will appear here</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sentiment Tiny (client) ---------------- */
function SentimentTiny() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(null);

  const calc = (t) => {
    const pos = ["great","love","fast","clean","awesome","amazing","win","wow","smooth","reliable"];
    const neg = ["bad","slow","bug","hate","broken","noisy","crash","fail","pain","lag"];
    let s = 0; const low = t.toLowerCase();
    pos.forEach((w) => { if (low.includes(w)) s += 1; });
    neg.forEach((w) => { if (low.includes(w)) s -= 1; });
    setScore(s);
  };

  return (
    <div className="card relative">
      <Doodle>🤖</Doodle>
      <div className="text-xl font-bold flex items-center gap-2"><Sparkles size={16} /> Sentiment Tiny (client)</div>
      <p className="opacity-90">A teeny rule-based analyzer for quick UX copy checks — no API calls.</p>

      <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
        <KPI label="p50" value="~1ms" />
        <KPI label="p95" value="~2ms" />
        <KPI label="GPU mem" value="0GB" />
      </div>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); calc(e.target.value); }}
        placeholder="Paste text and I’ll rate the vibes…"
        className="w-full min-h-[120px] rounded-xl bg-black/30 border border-white/10 p-3"
      />
      <div className="mt-2 text-sm">
        Score: {score === null ? "—" : score > 1 ? "😀 Positive-ish" : score < -1 ? "🙁 Needs love" : "😐 Neutral-ish"}
      </div>
    </div>
  );
}

/* ---------------- NEW #6: Smart Auto-Levels (client) ---------------- */
function SmartAutoLevels() {
  const [src, setSrc] = useState(null);
  const [out, setOut] = useState(null);
  const inputRef = useRef();

  const equalize = async (url) => {
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = url;
    await new Promise((r) => (img.onload = r));
    const w = 512, h = Math.round((img.height / img.width) * 512);
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    g.drawImage(img, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h);
    const p = d.data;
    // luminance
    const lum = new Uint8Array(w * h);
    for (let i = 0, j = 0; i < p.length; i += 4, j++) {
      lum[j] = (0.299 * p[i] + 0.587 * p[i+1] + 0.114 * p[i+2]) | 0;
    }
    // histogram
    const hist = new Uint32Array(256);
    for (let i = 0; i < lum.length; i++) hist[lum[i]]++;
    // cdf
    const cdf = new Uint32Array(256);
    let acc = 0; for (let i = 0; i < 256; i++) { acc += hist[i]; cdf[i] = acc; }
    const cdfMin = cdf.find(v => v > 0) || 0;
    const scale = 255 / (w*h - cdfMin || 1);
    // remap luminance & apply as gain
    for (let i = 0, j = 0; i < p.length; i += 4, j++) {
      const L = lum[j];
      const Leq = Math.max(0, Math.min(255, Math.round((cdf[L] - cdfMin) * scale)));
      const gain = (Leq + 1) / (L + 1);
      p[i]   = Math.max(0, Math.min(255, Math.round(p[i]   * gain)));
      p[i+1] = Math.max(0, Math.min(255, Math.round(p[i+1] * gain)));
      p[i+2] = Math.max(0, Math.min(255, Math.round(p[i+2] * gain)));
    }
    g.putImageData(d, 0, 0);
    setOut(c.toDataURL("image/png"));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setSrc(url);
    equalize(url);
  };

  return (
    <div className="card relative">
      <Doodle>🧰</Doodle>
      <div className="text-xl font-bold flex items-center gap-2">
        <ImageIcon size={16} /> Smart Auto-Levels (client)
      </div>
      <p className="opacity-90">Histogram equalization for punchier images — fast and fully in-browser.</p>

      <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
        <KPI label="p50" value="~24ms" />
        <KPI label="p95" value="~60ms" />
        <KPI label="GPU mem" value="0GB" />
      </div>

      <div className="rounded-xl border border-dashed border-white/20 bg-white/4 p-4 grid sm:grid-cols-2 gap-4">
        <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {src ? <img src={src} className="max-h-[300px] object-contain" /> :
            <button onClick={() => inputRef.current?.click()} className="btn"><Upload size={16} /> Choose Image</button>}
          <input ref={inputRef} hidden type="file" accept="image/*" onChange={onFile} />
        </div>
        <div className="min-h-[220px] bg-black/30 grid place-items-center rounded-lg overflow-hidden">
          {out ? <img src={out} className="max-h-[300px] object-contain" /> :
            <div className="text-white/60">Enhanced image will appear here</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Live Demos page ---------------- */
export default function LiveDemos() {
  return (
    <section className="section" id="live-demos">
      <div className="container-page">
        {/* Toolbar at the TOP of Live Demos */}
        <ServerToolbar />

        {/* Demos (now 6 cards) */}
        <div className="grid xl:grid-cols-2 gap-8">
          <BrainScan />
          <NeonStyleTransfer />
          <EdgeFinder />
          <PaletteExtractor />
          <SentimentTiny />
          <SmartAutoLevels />
        </div>
      </div>
    </section>
  );
}
