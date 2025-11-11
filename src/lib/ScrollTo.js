// src/lib/scrollTo.js
export function scrollToId(id, opts = { behavior: "smooth", block: "start" }) {
  const el = document.getElementById(id);
  if (!el) return;
  // If a previous scroll is still in progress, cancel it by calling again
  try {
    el.scrollIntoView(opts);
    // Move focus for accessibility (so repeated clicks still work)
    el.tabIndex = -1;
    el.focus({ preventScroll: true });
  } catch {}
}
