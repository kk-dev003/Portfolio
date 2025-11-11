import React, { useState } from "react";
import Navbar from "../components/shared/Navbar";
import Projects from "../components/Projects";
import Footer from "../components/Footer";

export default function ProjectsPage() {
  const [tab, setTab] = useState("all"); // 'all' | 'live'

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <button
              className={`badge ${tab==='all' ? 'bg-white text-black' : ''}`}
              onClick={() => setTab("all")}
            >
              All Projects (10)
            </button>
            <button
              className={`badge ${tab==='live' ? 'bg-white text-black' : ''}`}
              onClick={() => setTab("live")}
            >
              Live Projects (5)
            </button>
          </div>
        </div>
      </section>

      {tab === "all" ? (
        <Projects title="All Projects" filter="all" />
      ) : (
        <Projects title="Live Projects" filter="live" />
      )}

      <Footer smiles={123} />
    </div>
  );
}
