// src/components/ChatBubble.jsx
import React from "react";

export function ChatBubble({ message, from = "bot" }) {
  // from: 'customer' | 'agent' | 'bot' | 'system'
  const isBot = from === "bot";
  const isAgent = from === "agent";
  const containerClasses = isBot ? "self-start" : "self-end";
  const bubbleClasses = isBot
    ? "bg-slate-100 text-slate-800"
    : isAgent
    ? "bg-emerald-600 text-white"
    : "bg-indigo-600 text-white";
  return (
    <div className={`flex ${containerClasses} my-2`}>
      <div className={`px-4 py-2 rounded-lg max-w-[72%] ${bubbleClasses} shadow-sm`}>
        <div className="text-sm">{message}</div>
        <div className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
