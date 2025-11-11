import React from "react";
import { useParams, Link } from "react-router-dom";
import Section from "../components/shared/Section";

const DB = {
  instafy: {
    title: "Instafy — AI Image Transformation SaaS",
    summary: "Real-time style transfer with streaming previews and GPU-efficient serving.",
    impact: [
      "≈30 FPS @720p on A10; cold-start < 1.5s with warm pool.",
      "Reduced user drop by 18% after adding progressive previews + rate-limit hints.",
      "Tracing + p95 guardrails slashed tail latency incidents by 42%."
    ],
    approach: [
      "ONNX/TensorRT graph optimizations; tile-aware batching via WebSocket.",
      "Eval harness for perceptual quality + user-reported delight score.",
      "Feature flags + phased rollout with success metrics on Grafana."
    ],
    stack: "ONNX, TensorRT, FastAPI, Redis, WebSocket, Docker, Grafana",
  },
  brainscan: {
    title: "BrainScan — MRI Tumor Segmentation",
    summary: "UNet ONNX model exposed via FastAPI for consistent binary masks and lean reports.",
    impact: [
      "Dice ≈ 0.86 on internal validation; stable across 3 scanners.",
      "Automated mask reports with area% lowered manual review time by ~35%.",
      "SLO: p95 < 220ms on A10; back-pressure under surge loads."
    ],
    approach: [
      "Augmentations + normalization parity with clinical PACS preprocessing.",
      "ONNXRuntime CUDA; simple post-proc; clear governance for versioning.",
      "Operation dashboards with error budgets + SLA alerts."
    ],
    stack: "UNet, ONNXRuntime, FastAPI, Prometheus/Grafana, Airflow (batch re-eval)",
  },
  silica: {
    title: "AI LMS — Silica Institute",
    summary: "Grounded tutoring with RAG + feedback loop; reduced hallucinations and support load.",
    impact: [
      "Hallucinations ↓ 42% via better chunking + retrieval evals.",
      "Instructor workload ↓ ~40% thanks to automations.",
      "Student CSAT +16 points post-launch."
    ],
    approach: [
      "FAISS index + rerankers; prompt tests; guardrails for tone & citations.",
      "Eval harness (BLEU/precision@k + spot checks).",
      "Rollout playbook and adoption docs for non-technical staff."
    ],
    stack: "LangChain, FAISS, FastAPI, Postgres, Docker",
  },
  "smart-vision": {
    title: "Smart Vision — Retail Defect Detection",
    summary: "Edge-friendly CV pipeline to flag shelf anomalies in near real-time.",
    impact: ["mAP@50 0.91; false positives ↓ 23%", "Ops alerts with camera health checks"],
    approach: ["ONNX export; lightweight post-proc", "A/B of thresholds per category"],
    stack: "PyTorch, ONNX, FastAPI, MQTT, Grafana",
  },
  "pricing-lab": {
    title: "Pricing Lab — Elasticity Modeling",
    summary: "Elasticity curves and promo uplift simulation for category managers.",
    impact: ["Gross margin ↑ 3.1% in pilot markets", "Clear explainability visuals drove adoption"],
    approach: ["Hierarchical models; back-testing", "Weekly model health checks"],
    stack: "sklearn, pandas, Airflow, Metabase",
  },
  "etl-guard": {
    title: "ETL Guard — Data Quality Monitor",
    summary: "Great Expectations + drift checks to keep pipelines honest.",
    impact: ["Bad loads ↓ 68%; MTTR ↓ 52%", "Pager noise ↓ via correlated alerts"],
    approach: ["Rule library + drift heuristics", "Owner-first runbooks"],
    stack: "Great Expectations, Airflow, Postgres, Grafana",
  },
  "gpu-metrics": {
    title: "GPU Metrics Board",
    summary: "Latency/throughput/memory dashboards to make performance visible.",
    impact: ["p50 25ms • p99 80ms", "Feature owners got weekly scorecards"],
    approach: ["Prom + Grafana + exemplars", "Budgeted error rates"],
    stack: "FastAPI, Prometheus, Grafana, OpenTelemetry",
  },
  "agent-lab": {
    title: "Agent Lab — Autonomous Tools",
    summary: "Task-oriented agents with eval & safety rails.",
    impact: ["Task success ↑ 22%", "Failure modes documented & mitigated"],
    approach: ["Tool use constraints; replayable evals", "Dataset versioning"],
    stack: "LLMs, LangChain/Tools, Weights & Biases",
  },
  "viz-playground": {
    title: "Viz Playground — Interactive Data",
    summary: "60fps visuals for complex datasets—playful yet practical.",
    impact: ["Demos closed 2 enterprise leads", "Users retained patterns faster"],
    approach: ["GPU-accelerated plots; debounced filters", "A11y-tested coloring"],
    stack: "D3, WebGL, React",
  },
  chatfusion: {
    title: "ChatFusion — Conversational AI",
    summary: "Grounded QA with traceable answers and eval-driven improvements.",
    impact: ["Latency hit 1.3s avg", "Trust improved via transparent citations"],
    approach: ["Retriever + reranker; prompt tests", "Observability-first design"],
    stack: "RAG, vectordb, FastAPI, OpenTelemetry",
  },
};

export default function CaseStudy() {
  const { slug } = useParams();
  const cs = DB[slug];
  if (!cs) {
    return (
      <Section title="Case Study">
        <div className="card">Unknown case. <Link className="text-neonCyan" to="/projects">Back to projects</Link></div>
      </Section>
    );
  }
  return (
    <Section title={cs.title}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p className="opacity-90">{cs.summary}</p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Impact</h3>
          <ul className="list-disc list-inside space-y-1 opacity-90">
            {cs.impact.map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Approach</h3>
          <ul className="list-disc list-inside space-y-1 opacity-90">
            {cs.approach.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
        <div className="card h-max">
          <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
          <p className="opacity-90">{cs.stack}</p>
          <div className="mt-6">
            <Link to="/live" className="btn btn-primary w-full">Try Live Demos</Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
