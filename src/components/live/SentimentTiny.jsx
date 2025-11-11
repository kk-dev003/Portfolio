import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function SentimentTiny() {
  const [text,setText]=useState("");
  const [score,setScore]=useState(null);

  const calc = (t)=>{
    const pos=["great","love","fast","clean","awesome","amazing","win","wow","smooth","reliable"];
    const neg=["bad","slow","bug","hate","broken","noisy","crash","fail","pain","lag"];
    let s=0;
    const low=t.toLowerCase();
    pos.forEach(w=>low.includes(w)?s++:0);
    neg.forEach(w=>low.includes(w)?s--:0);
    setScore(s);
  };

  return (
    <div className="card relative">
      <div className="text-xl font-bold flex items-center gap-2">
        <Sparkles size={16}/> Sentiment Tiny
      </div>
      <p className="opacity-80 mb-3">Tiny instant rule-based vibe check.</p>

      <textarea
        value={text}
        onChange={(e)=>{setText(e.target.value);calc(e.target.value);}}
        placeholder="Paste text here…"
        className="w-full min-h-[120px] rounded-xl bg-black/30 border border-white/10 p-3"
      />

      <div className="mt-2 text-sm">
        Score: {score===null?"—":score>1?"😀 Positive":score<-1?"🙁 Negative":"😐 Neutral"}
      </div>
    </div>
  );
}
