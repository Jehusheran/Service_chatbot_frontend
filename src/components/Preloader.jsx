// src/components/Preloader.jsx
import React, { useEffect } from "react";

export default function Preloader({ onDone }) {
  // onDone optional callback after preloader finishes
  useEffect(() => {
    // small UX delay to let initial assets load
    const t = setTimeout(() => {
      // remove static preloader div in index.html (if any)
      const root = document.getElementById("preloader-root");
      if (root) {
        root.style.transition = "opacity 300ms";
        root.style.opacity = "0";
        setTimeout(() => root.remove(), 320);
      }
      if (onDone) onDone();
    }, 600);

    return () => clearTimeout(t);
  }, [onDone]);

  // Note: this component should be rendered inside React while app initializes.
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="w-20 h-20 animate-spin-smooth text-indigo-600" viewBox="0 0 50 50" aria-hidden>
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="31.4 31.4"></circle>
        </svg>
        <div className="text-slate-600">Loading Service Chatbot…</div>
      </div>
    </div>
  );
}
