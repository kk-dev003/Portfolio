import React, { useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

export default function FunModeLayer({ enabled }) {
  // fire a tiny burst when turning ON
  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(() => {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.2 } });
      } catch {}
    }, 60);
    return () => clearTimeout(id);
  }, [enabled]);

  const doodles = useMemo(() => {
    if (!enabled) return null;
    return Array.from({ length: 16 }).map((_, idx) => {
      const size = 28 + (idx % 5) * 6;
      const left = Math.random() * 100;
      const dur = 14 + (idx % 5) * 3;
      const delay = Math.random() * 5;
      const emoji = ["🤖", "🧠", "⚙️", "✨", "📈", "☕", "💾", "🧪"][idx % 8];
      return (
        <div
          key={idx}
          className="pointer-events-none fixed top-[-8vh] select-none"
          style={{
            left: `${left}%`,
            fontSize: size,
            animation: `floatDown ${dur}s linear ${delay}s infinite`,
            filter: "drop-shadow(0 6px 8px rgba(0,0,0,.35))",
            zIndex: 60,
          }}
          aria-hidden
        >
          {emoji}
        </div>
      );
    });
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @keyframes floatDown {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: .9; }
          100% { transform: translateY(115vh) rotate(360deg); opacity: .9; }
        }
      `}</style>
      <div className="fixed inset-0 z-[60]" aria-hidden>
        {doodles}
      </div>
    </>
  );
}
