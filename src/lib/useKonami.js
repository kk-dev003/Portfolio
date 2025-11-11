import { useEffect } from "react";
export default function useKonami(onTrigger) {
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let i = 0;
    const onKey = (e) => {
      if (e.key === seq[i]) { i++; if (i === seq.length) { onTrigger?.(); i = 0; } }
      else i = 0;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTrigger]);
}
