// src/components/shared/Section.jsx
import React from "react";

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="section kk-section">
      <div className="container-page">
        {title && <h2 className="section-title text-2xl font-semibold mb-6">{title}</h2>}
        <div>{children}</div>
      </div>
    </section>
  );
}
