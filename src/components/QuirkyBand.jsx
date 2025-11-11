import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "Built with love, coffee, and a lot of tensors.",
  "I break things locally so prod sleeps peacefully.",
  "Latency is a feature. So is documentation.",
  "If it’s not observable, it’s not reliable.",
  "Shipping > demoing. But hey, I do both.",
  "GPU warm. Tests green. Dashboard cozy.",
];

export default function QuirkyBand() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % LINES.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="py-6 border-y border-white/10 bg-white/5">
      <div className="container-page text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-white/90"
          >
            {LINES[i]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
