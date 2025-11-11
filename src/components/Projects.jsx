import React, { useMemo, useState } from "react";
import Section from "./shared/Section";
import { Link } from "react-router-dom";
import { Sparkles, ImageIcon, Bot, Workflow } from "lucide-react";

const img = (file) => { try { return new URL(`../assets/${file}`, import.meta.url).href; } catch { return null; } };

const PROJECTS = [
  { id:1, slug:'instafy',       title:'Instafy — AI Image Transformation SaaS',    cat:'Computer Vision', tech:'ONNX • CUDA • WebSockets', desc:'Real-time style transfer with streaming previews.', live:true,  metrics:'≈30 FPS @720p', hero:'instafy.jpg' },
  { id:2, slug:'brainscan',     title:'BrainScan — Tumor Segmentation',            cat:'ML',              tech:'UNet ONNX • FastAPI',     desc:'MRI segmentation overlays with clean reports.',      live:true,  metrics:'Dice ≈ 0.86', hero:'braintumor.jpg' },
  { id:3, slug:'silica',        title:'AI LMS — Silica Institute',                  cat:'NLP',             tech:'LangChain • FAISS',      desc:'Grounded tutoring with citations & feedback loop.',  live:true,  metrics:'–42% hallucinations', hero:'AI-LMS.jpg' },
  { id:4, slug:'chatfusion',    title:'ChatFusion — Conversational AI',            cat:'NLP',             tech:'RAG • Tools • Tracing',  desc:'Grounded QA with eval harness & tracing.',          live:true,  metrics:'1.3s avg', hero:'chat-fusion.jpg' },
  { id:5, slug:'smart-vision',  title:'Smart Vision — Retail Defect Detection',    cat:'Computer Vision', tech:'PyTorch • FastAPI',       desc:'Shelf anomaly detection at the edge.',              live:true,  metrics:'mAP@50 0.91', hero:'retail-defect.jpg' },
  { id:6, slug:'pricing-lab',   title:'Pricing Lab — Elasticity Modeling',         cat:'ML',              tech:'Sklearn • Airflow',      desc:'Promo uplift and elasticity curves.',               live:false, metrics:'↑ GM 3.1%', hero:'pricing-model.jpg' },
  { id:7, slug:'etl-guard',     title:'ETL Guard — Data Quality Monitor',          cat:'ML',              tech:'Airflow • GE',           desc:'Data quality bouncer with drift checks.',           live:false, metrics:'↓ bad loads 68%', hero:'etl-data-monitor.jpg' },
  { id:8, slug:'gpu-metrics',   title:'GPU Metrics Board',                          cat:'ML',              tech:'FastAPI • Grafana',      desc:'Latency/throughput/memory dashboards.',             live:false, metrics:'p50 25ms • p99 80ms', hero:'GPU-metrics.jpg' },
  { id:9, slug:'agent-lab',     title:'Agent Lab — Autonomous Tools',              cat:'NLP',             tech:'LLM Agents • Eval',      desc:'Task-oriented agents with safety rails.',           live:false, metrics:'↑ task success 22%', hero:'AI-agent.jpg' },
  { id:10,slug:'viz-playground',title:'Viz Playground — Interactive Data',          cat:'ML',              tech:'D3 • WebGL',             desc:'Data that dances at 60fps.',                         live:false, metrics:'60fps interactions', hero:'viz-playground.jpg' },
];

const CATS = ["All","ML","NLP","Computer Vision"];
const doodle = { "Computer Vision": <ImageIcon size={16}/>, NLP: <Bot size={16}/>, ML: <Workflow size={16}/> };

function Thumb({ file, title }) {
  const src = file ? img(file) : null;
  if (src) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-white/12"
           style={{ aspectRatio: "16/9" }}>
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center select-none will-change-transform"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.38))" }}
        />
      </div>
    );
  }
  const initials = title.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/12 grid place-items-center text-4xl font-black"
         style={{ aspectRatio:"16/9", background:"linear-gradient(135deg,#1e1333,#0b2a36)" }}>
      <div className="absolute -inset-10 blur-2xl opacity-35"
           style={{ background:"conic-gradient(from 90deg,#B026FF,#00F5FF,#FFD26A,#B026FF)" }}/>
      <span className="relative">{initials}</span>
    </div>
  );
}

export default function Projects({ filter="all", title="Featured Projects" }) {
  const [cat, setCat] = useState("All");
  const list = useMemo(() => {
    let base = filter === "live" ? PROJECTS.filter(p=>p.live) : PROJECTS;
    return cat === "All" ? base : base.filter((p) => p.cat === cat);
  }, [cat, filter]);

  return (
    <Section id="projects" title={title}>
      <div className="mb-6 flex flex-wrap gap-3">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full transition border ${
              cat === c
                ? "bg-white text-black border-white shadow"
                : "bg-white/22 text-white border-white/35 hover:bg-white/35"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {list.map((p) => (
          <div key={p.id} className="card relative overflow-hidden">
            <div className="absolute -right-2 -top-2 opacity-40 pointer-events-none">
              <Sparkles className="animate-pulse" size={20}/>
            </div>

            <Thumb file={p.hero} title={p.title} />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xl font-bold flex items-center gap-2">
                <span className="opacity-80">{doodle[p.cat] || <Sparkles size={16}/>}</span>
                {p.title}
              </div>
              {p.live && <span className="badge bg-white/20">LIVE</span>}
            </div>
            <div className="opacity-90">{p.desc}</div>
            <div className="mt-2 text-sm opacity-70">{p.tech}</div>
            <div className="mt-2 text-neonCyan">{p.metrics}</div>
            <div className="mt-4 flex gap-3">
              <Link to={`/case/${p.slug}`} className="btn btn-primary">View Case Study</Link>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
