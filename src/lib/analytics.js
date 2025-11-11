const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function track(event, data = {}) {
  try {
    await fetch(`${API_BASE}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data })
    });
  } catch {
    // fallback: store locally, flush later if needed
    const key = "kk_analytics_queue";
    const q = JSON.parse(localStorage.getItem(key) || "[]");
    q.push({ ts: Date.now(), event, data });
    localStorage.setItem(key, JSON.stringify(q));
  }
}
