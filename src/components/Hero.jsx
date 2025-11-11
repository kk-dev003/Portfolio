// src/components/Hero.jsx — FULL REPLACE
import React, { useState } from "react";
import { motion } from "framer-motion";

const avatarUrl = new URL("../assets/komal-avatar.jpg", import.meta.url).href;

export default function Hero() {
  const [ok, setOk] = useState(true);

  return (
    // IMPORTANT: use a unique id for the top of page (no more id="about" here)
    <section
      id="top"
      className="section relative isolate"
      style={{
        background:
          "radial-gradient(1200px 600px at 15% 10%, rgba(176,38,255,.18) 0%, rgba(176,38,255,0) 60%), radial-gradient(1000px 600px at 90% 80%, rgba(0,245,255,.18) 0%, rgba(0,245,255,0) 60%)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
      }}
    >
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Komal Kumavat
          </h1>
          <p className="mt-3 text-xl font-semibold text-softAmber">AI/ML Developer</p>

          {/* Recruiter banner — crisp, non-AI-y, merged voice */}
          <div className="mt-4 rounded-2xl bg-white/6 border border-white/10 px-4 py-3 text-[15px]">
            <span className="font-semibold">
              I wire models to product—quick, stable, measurable.
            </span>{" "}
            The kind of AI that keeps dashboards green and weekends free.
          </div>

          <p className="mt-4 text-lg text-white/90 max-w-xl">
            From CV & NLP to agentic workflows, I ship <span className="font-semibold">low-latency,
            observable, calm-in-prod</span> features that users love and SREs trust.
          </p>

          <ul className="mt-4 text-white/80 text-sm space-y-1 max-w-xl list-disc list-inside">
            <li>LLM/RAG & CV with eval harnesses and rollout controls</li>
            <li>GPU-aware serving (ONNX/TensorRT), tracing, SLOs</li>
            <li>Stakeholder-friendly delivery: milestones, metrics, ownership</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Use hash anchors so navbar & smooth scroll just work */}
          <a href="/#projects" className="btn btn-primary">See Projects</a>
          <a href="/live" className="btn btn-ghost">Live Demos</a>

          </div>
        </div>

        {/* RIGHT — big avatar; no glow; hover tilt */}
        <div className="justify-self-center w-full flex items-center justify-center">
          <motion.img
            src={avatarUrl}
            alt="Komal — avatar"
            onError={() => setOk(false)}
            initial={{ opacity: 0, y: 8, rotate: -1.2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ rotate: -2.5, scale: 1.02 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-[520px] max-w-[92vw] object-contain select-none drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] will-change-transform"
          />
          {!ok && <div className="sr-only">Avatar failed to load</div>}
        </div>
      </div>
    </section>
  );
}
