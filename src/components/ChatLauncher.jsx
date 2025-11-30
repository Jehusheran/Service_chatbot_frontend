// src/components/ChatLauncher.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";

export default function ChatLauncher({ startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  const [messages, setMessages] = useState([
    { text: "Hi 👋 I'm the service bot. Need help booking?" , from: "bot" }
  ]);
  const [text, setText] = useState("");

  const containerRef = useRef();

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // keep launcher open if you want global persist; here we keep as-is
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function send() {
    if (!text) return;
    setMessages((s) => [...s, { text, from: "customer" }]);
    setText("");
    // optimistic bot reply after small delay
    setTimeout(() => {
      setMessages((s) => [...s, { text: "Thanks — agent will join shortly or you can book a slot here.", from: "bot" }]);
    }, 700);
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="w-[340px] md:w-[420px] bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold">SC</div>
              <div>
                <div className="text-sm font-medium">Service Bot</div>
                <div className="text-xs opacity-80">Chat with bot or request agent</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white opacity-90">Close</button>
          </div>

          <div className="p-4 h-72 overflow-auto flex flex-col">
            {messages.map((m, i) => <ChatBubble key={i} message={m.text} from={m.from} />)}
          </div>

          <div className="p-3 border-t flex gap-2 items-center">
            <input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>{ if (e.key === "Enter") send(); }} className="flex-1 px-3 py-2 border rounded-md" placeholder="Type a message..." />
            <button onClick={send} className="px-3 py-2 rounded bg-indigo-600 text-white">Send</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((s) => !s)}
        className="mt-3 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center chat-launcher hover:scale-105 transition"
        aria-label="Open chat"
      >
        💬
      </button>
    </div>
  );
}
