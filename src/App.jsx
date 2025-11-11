import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./shared/Section";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DATA = [
  {
    name: "Ananya Deshpande",
    role: "Head of Engineering, Silica Institute",
    quote:
      "Komal took our tutoring product from ‘promising’ to ‘production’. The grounded answers and evaluation harness slashed rework for instructors. She’s unusually good at translating stakeholder goals into measurable ML outcomes.",
  },
  {
    name: "James O’Connor",
    role: "CTO, Retail Ops Startup",
    quote:
      "Her CV pipeline caught edge cases our team missed for months. The dashboards, SLOs, and clean rollout plan made leadership comfortable shipping fast. Calm under pressure and very senior in how she communicates tradeoffs.",
  },
  {
    name: "Meera Shah",
    role: "Product Manager, Conversational AI",
    quote:
      "ChatFusion hit our latency goals in week two. Komal gave us crisp metrics, clear traces, and a phased launch plan. Our agents trust the tool because she made quality visible—not just promised.",
  },
  {
    name: "Victor Almeida",
    role: "Data Platform Lead",
    quote:
      "ETL Guard reduced bad loads dramatically. Komal built guardrails that alerted with context, not noise. We stopped doing 2 a.m. firefights, and the business noticed.",
  },
  {
    name: "Rhea Kapoor",
    role: "Founder, Creator Tools",
    quote:
      "Instafy’s live previews are delightful. We saw a bump in retention immediately. Komal handles GPU stuff with the same care she puts into UX—rare and valuable.",
  },
  {
    name: "Samir Qureshi",
    role: "Director of Analytics",
    quote:
      "Pricing Lab gave our category managers facts, not hunches. Komal’s docs were crystal clear and adoption was frictionless. She ships reliable, boring-in-the-best-way systems.",
  },
  {
    name: "Julia Weber",
    role: "Design Lead",
    quote:
      "I appreciate how Komal keeps interfaces friendly even when the ML is complex. Small details—progressive loading, tooltips, sane defaults—made it feel premium.",
  },
  {
    name: "Omar Nassar",
    role: "Platform Engineer",
    quote:
      "She instrumented everything. When a deployment hiccup happened, we had traces, timings, and a quick rollback path. That level of operational maturity is rare.",
  },
  {
    name: "Tanya Gupta",
    role: "VP, Customer Success",
    quote:
      "Support tickets dropped after the RAG improvements. Komal kept us looped with weekly metrics that non-technical leaders could understand. A+ partner.",
  },
  {
    name: "Diego Fernandez",
    role: "Staff ML Engineer",
    quote:
      "Great collaborator. Strong opinions, loosely held. We iterated quickly because she came prepared with data and ablations—not vibes.",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);

  const prev = () => setI((v) => (v - 1 + DATA.length) % DATA.length);
  const next = () => setI((v) => (v + 1) % DATA.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <Section id="testimonials" title="Testimonials">
      <div className="relative max-w-3xl mx-auto">
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute -left-3 top-1/2 -translate-y-1/2 btn"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={next}
          aria-label="Next"
          className="absolute -right-3 top-1/2 -translate-y-1/2 btn"
        >
          <ChevronRight size={18} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="card text-center px-6 py-8"
          >
            <div className="text-lg leading-relaxed opacity-95">“{DATA[i].quote}”</div>
            <div className="mt-5 font-semibold">{DATA[i].name}</div>
            <div className="text-white/70 text-sm">{DATA[i].role}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
