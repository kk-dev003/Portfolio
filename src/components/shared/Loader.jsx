import React, { useEffect, useState } from "react";
import brainLogo from "../../assets/logo-brain.jpg"; // use a real, existing asset

export default function Loader() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // respect reduced motion
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 400 : 1200;
    const t = setTimeout(() => setHide(true), ms);
    return () => clearTimeout(t);
  }, []);

  if (hide) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#0a0815]">
      <div className="relative">
        <img
          src={brainLogo}
          alt="Loading"
          className="h-20 w-20 rounded-full object-cover select-none"
          draggable={false}
        />
        <div
          className="absolute inset-0 rounded-full animate-ping-slow"
          style={{ boxShadow: "0 0 40px rgba(0,245,255,.35)" }}
        />
      </div>

      <style>{`
        .animate-ping-slow {
          animation: pingy 1.1s ease-in-out infinite;
        }
        @keyframes pingy {
          0%   { transform: scale(0.94); opacity: .65; }
          50%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(0.94); opacity: .65; }
        }
      `}</style>
    </div>
  );
}
