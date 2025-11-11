// src/components/About.jsx
import React from "react";

export default function About() {
  return (
    <section id="about" className="section kk-section">
      <div className="container-page grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-semibold mb-3">About</h2>

          <p className="text-lg text-white/90 leading-relaxed">
            <strong>I wire models to product—quick, stable, measurable.</strong>{" "}
            The kind of AI that keeps dashboards green and weekends free.
          </p>

          <ul className="mt-6 space-y-2 text-white/80">
            <li>• LLM/RAG & CV pipelines with eval harnesses</li>
            <li>• GPU-aware serving (ONNX/TensorRT), tracing, SLOs</li>
            <li>• Calm, observable production ops with clean dashboards</li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-3xl mb-2">🧠</div>
            <p className="text-sm text-white/80">
              Brainy by day, benchmark-nerd by night. Ask me about p50/p95,
              error budgets, and how I keep prod quiet—even on Mondays.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
