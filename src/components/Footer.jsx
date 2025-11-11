import React from "react";

export default function Footer({ smiles = 0 }) {
  return (
    <footer className="mt-16">
      <div className="h-1 bg-gradient-to-r from-neonMagenta via-softAmber to-neonCyan opacity-70" />
      <div className="container-page py-8 text-sm text-white/75 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div>
          © {new Date().getFullYear()} Komal Kumavat — Built with love, coffee, and a lot of tensors ☕🧠
        </div>
        <div className="opacity-80">
          You’ve made <span className="text-softAmber font-semibold">{smiles}</span> robots smile today 🤖
        </div>
      </div>
    </footer>
  );
}
