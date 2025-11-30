// src/components/SkeletonLoader.jsx
import React from "react";

export default function SkeletonLoader({ type = "text", className = "" }) {
  if (type === "avatar") {
    return <div className={`w-10 h-10 rounded-full skeleton ${className}`} />;
  }
  if (type === "card") {
    return (
      <div className={`p-4 rounded-lg bg-white border skeleton ${className}`}>
        <div className="h-4 w-3/4 mb-3 skeleton" />
        <div className="h-3 w-full mb-2 skeleton" />
        <div className="h-3 w-5/6 skeleton" />
      </div>
    );
  }
  // default text row
  return <div className={`h-4 w-full rounded skeleton ${className}`} />;
}
