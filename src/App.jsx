// src/App.jsx
import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import api from "./api";

/* ---------------------------
   Top-level App & Layout
   --------------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <TopNav />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/customer" element={<CustomerPanel />} />
              <Route path="/agent" element={<AgentPanel />} />
              <Route path="/manager" element={<ManagerPanel />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

/* ---------------------------
   Navigation / Sidebar
   --------------------------- */

function TopNav() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold">
            SC
          </div>
          <div>
            <div className="text-lg font-semibold">Service Chatbot</div>
            <div className="text-xs text-slate-500">Agent + Bot + Manager Console</div>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/customer" className="hover:text-indigo-600">Customer</Link>
          <Link to="/agent" className="hover:text-indigo-600">Agent</Link>
          <Link to="/manager" className="hover:text-indigo-600">Manager</Link>
          <Link to="/booking" className="rounded-md px-3 py-2 bg-indigo-600 text-white text-sm hover:opacity-95">Book</Link>
        </nav>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="w-72 hidden lg:block border-r bg-white">
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium text-slate-600">Quick Actions</div>

        <ul className="space-y-1">
          <li>
            <Link to="/customer" className="block px-3 py-2 rounded hover:bg-slate-50">Chat as Customer</Link>
          </li>
          <li>
            <Link to="/agent" className="block px-3 py-2 rounded hover:bg-slate-50">Agent Console</Link>
          </li>
          <li>
            <Link to="/manager" className="block px-3 py-2 rounded hover:bg-slate-50">Summaries & Reports</Link>
          </li>
          <li>
            <Link to="/booking" className="block px-3 py-2 rounded hover:bg-slate-50">Book / Reschedule</Link>
          </li>
        </ul>

        <div className="pt-4 border-t">
          <div className="text-xs text-slate-500">Status</div>
          <div className="text-sm mt-2">Backend: <BackendStatus /></div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------------------
   Pages
   --------------------------- */

function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="text-slate-600">This demo shows a WhatsApp-style messaging system with agent, bot, and manager workflows. Use the left menu or top nav to switch panels.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Customer Chat" desc="Chat with bot or a specific agent. Use agent id to continue the same thread." to="/customer" />
        <Card title="Agent Panel" desc="Agents can pick a customer and see full history / reply." to="/agent" />
        <Card title="Manager" desc="See AI summaries and date-filtered summaries." to="/manager" />
      </div>
    </div>
  );
}

function CustomerPanel() {
  // simple customer login simulation
  const [customerId, setCustomerId] = useState(localStorage.getItem("customer_id") || "customer1");
  const [mode, setMode] = useState("bot"); // 'bot' | 'agent'
  const [agentId, setAgentId] = useState("");

  useEffect(() => {
    localStorage.setItem("customer_id", customerId);
  }, [customerId]);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-600">Customer ID</label>
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <div className="ml-6 flex items-center gap-2">
          <label className="text-sm">Mode</label>
          <select className="px-2 py-1 border rounded" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="bot">Chat with Bot</option>
            <option value="agent">Chat with Agent</option>
          </select>
        </div>
      </div>

      {mode === "agent" && (
        <div className="flex items-center gap-3">
          <input
            placeholder="Enter Agent ID (e.g., agent1)"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="px-3 py-2 border rounded-md flex-1"
          />
          <div className="text-sm text-slate-500">Tip: re-enter same Agent ID to resume thread</div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <ChatWidget
          mode={mode}
          customerId={customerId}
          agentId={mode === "agent" ? (agentId || null) : null}
        />
      </div>
    </div>
  );
}

function AgentPanel() {
  const [agentId, setAgentId] = useState(localStorage.getItem("agent_id") || "agent1");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    localStorage.setItem("agent_id", agentId);
  }, [agentId]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-600">Agent ID</label>
        <input value={agentId} onChange={(e) => setAgentId(e.target.value)} className="px-3 py-2 border rounded-md" />
        <label className="text-sm text-slate-600 ml-4">Customer ID</label>
        <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="px-3 py-2 border rounded-md" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <AgentChatWidget customerId={customerId || null} agentId={agentId} />
      </div>
    </div>
  );
}

function ManagerPanel() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Manager Dashboard</h2>
      <p className="text-sm text-slate-600">Generate AI summaries by customer and date range.</p>

      <SummaryGenerator />
    </div>
  );
}

function BookingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Booking / Appointments</h2>
      <p className="text-sm text-slate-600">Create, reschedule, and cancel appointments connected to Google Calendar (or chosen provider).</p>

      <BookingWidget />
    </div>
  );
}

function NotFound() {
  return <div className="p-10 text-center">Page not found — <Link to="/">Go home</Link></div>;
}

/* ---------------------------
   Tiny UI building blocks
   --------------------------- */

function Card({ title, desc, to = "#" }) {
  return (
    <Link to={to} className="block p-4 bg-white border rounded-md hover:shadow-lg transition-all">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-500 mt-2">{desc}</div>
    </Link>
  );
}

function BackendStatus() {
  const [ok, setOk] = useState(null);
  useEffect(() => {
    let mounted = true;
    api
      .get("/healthz")
      .then(() => mounted && setOk(true))
      .catch(() => mounted && setOk(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (ok === null) return <span className="text-xs text-slate-400">checking...</span>;
  return ok ? <span className="text-green-600 font-medium">online</span> : <span className="text-red-600 font-medium">offline</span>;
}

/* ---------------------------
   Chat widgets (Customer and Agent)
   --------------------------- */

/**
 * ChatWidget for customers:
 * - mode: 'bot' | 'agent'
 * - customerId
 * - agentId (string or null)
 */
function ChatWidget({ mode = "bot", customerId, agentId = null }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  const convoAgentId = useMemo(() => {
    // Use null for bot-only chats; agents use a string id
    if (mode === "bot") return null;
    return agentId || null;
  }, [mode, agentId]);

  useEffect(() => {
    // Load history when customerId or agentId/mode changes
    let cancelled = false;
    async function fetchHistory() {
      setLoadingHistory(true);
      try {
        const url = `/v1/chat/history/${encodeURIComponent(customerId)}${convoAgentId ? `/${encodeURIComponent(convoAgentId)}` : "/bot"}`;
        const res = await api.get(url);
        if (!cancelled) {
          setMessages(res.data ?? []);
        }
      } catch (err) {
        // If endpoint not found, fall back to empty thread
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }
    if (customerId) fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [customerId, convoAgentId]);

  async function sendMessage() {
    if (!text || !customerId) return;
    const msg = { sender: "customer", message: text, message_id: `m-${Date.now()}`, created_at: new Date().toISOString() };
    // Optimistic UI
    setMessages((s) => [...s, msg]);
    setText("");
    try {
      const body = {
        customer_id: customerId,
        agent_id: convoAgentId, // null for bot chats or agent string
        messages: [msg],
      };
      await api.post("/v1/chat/save", body);
      // If bot responds immediately server-side you may get bot messages via history sync or websocket — omitted for now
    } catch (err) {
      console.error("Send failed", err);
      // optionally revert optimistic UI or mark failed
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Customer: {customerId}</div>
          <div className="text-xs text-slate-500">Mode: {mode}{convoAgentId ? ` — Agent ${convoAgentId}` : ""}</div>
        </div>
        <div className="text-xs text-slate-400">{loadingHistory ? "loading…" : `${messages.length} messages`}</div>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-3 bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-slate-400 mt-20">No messages yet. Say hi 👋</div>
        ) : (
          messages.map((m, idx) => (
            <MessageBubble key={m.message_id ?? idx} message={m} meSender="customer" />
          ))
        )}
      </div>

      <div className="p-4 border-t bg-white flex gap-3 items-center">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage} className="px-4 py-2 rounded bg-indigo-600 text-white hover:opacity-95">Send</button>
      </div>
    </div>
  );
}

/**
 * AgentChatWidget: agent chooses a customer and replies as agent.
 * props: customerId, agentId (string)
 */
function AgentChatWidget({ customerId, agentId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!customerId) {
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/v1/chat/history/${encodeURIComponent(customerId)}/${encodeURIComponent(agentId)}`);
        if (mounted) setMessages(res.data ?? []);
      } catch (err) {
        if (mounted) setMessages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [customerId, agentId]);

  async function sendAgent() {
    if (!customerId || !text) return;
    const msg = { sender: "agent", message: text, message_id: `a-${Date.now()}`, created_at: new Date().toISOString() };
    setMessages((s) => [...s, msg]);
    setText("");
    try {
      await api.post("/v1/chat/save", {
        customer_id: customerId,
        agent_id: agentId,
        messages: [msg],
      });
    } catch (err) {
      console.error("agent send failed", err);
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Agent: {agentId}</div>
          <div className="text-xs text-slate-500">Customer: {customerId || "—"}</div>
        </div>
        <div className="text-xs text-slate-400">{loading ? "loading…" : `${messages.length} msgs`}</div>
      </div>

      <div className="flex-1 p-4 overflow-auto bg-white space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-slate-400 mt-20">No conversation selected</div>
        ) : (
          messages.map((m, idx) => <MessageBubble key={m.message_id ?? idx} message={m} meSender="agent" />)
        )}
      </div>

      <div className="p-4 border-t bg-white flex gap-3 items-center">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder={customerId ? `Message ${customerId}...` : "Select customer to enable sending"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendAgent();
          }}
          disabled={!customerId}
        />
        <button onClick={sendAgent} disabled={!customerId} className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">Reply</button>
      </div>
    </div>
  );
}

/* ---------------------------
   Small components: Message bubble, Summary generator, Booking widget
   --------------------------- */

function MessageBubble({ message, meSender = "customer" }) {
  // message.sender is 'customer' | 'agent' | 'bot' | 'system'
  const isMe = message.sender === meSender;
  const align = isMe ? "self-end" : "self-start";
  const bg = message.sender === "bot" ? "bg-slate-100" : isMe ? "bg-indigo-600 text-white" : "bg-white border";
  return (
    <div className={`max-w-[70%] p-3 rounded-lg ${align} ${bg} shadow-sm`}>
      <div className={`text-sm ${message.sender === "bot" ? "text-slate-700" : isMe ? "text-white" : "text-slate-800"}`}>
        {message.message}
      </div>
      <div className="text-[10px] text-slate-400 mt-1">{new Date(message.created_at ?? Date.now()).toLocaleString()}</div>
    </div>
  );
}

function SummaryGenerator() {
  const [customerId, setCustomerId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!customerId) return;
    setLoading(true);
    try {
      // support range: GET /v1/summary/{customer}?start=...&end=...
      const params = {};
      if (start) params.start = start;
      if (end) params.end = end;
      const res = await api.get(`/v1/summary/${encodeURIComponent(customerId)}`, { params });
      setSummary(res.data);
    } catch (err) {
      console.error("summary failed", err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <div className="flex gap-3">
        <input placeholder="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="border px-3 py-2 rounded" />
        <button onClick={generate} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? "..." : "Generate"}</button>
      </div>

      {summary && (
        <div className="mt-4">
          <h3 className="font-medium">Summary</h3>
          <ul className="list-disc ml-5 mt-2 text-sm text-slate-700">
            {(summary.sentences || []).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function BookingWidget() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");

  async function loadSlots() {
    if (!date) return;
    try {
      const res = await api.get("/v1/schedule/slots", { params: { date } });
      setSlots(res.data || []);
    } catch (err) {
      console.error("load slots failed", err);
      setSlots([]);
    }
  }

  async function book() {
    if (!name || !email || !selectedSlot) {
      setMessage("Provide name, email and choose a slot");
      return;
    }
    try {
      const payload = {
        customer: { name, email },
        start: selectedSlot.start,
        end: selectedSlot.end,
        service_id: selectedSlot.service_id || "default",
      };
      const res = await api.post("/v1/schedule/book", payload);
      setMessage(`Booked: ${res.data?.booking_ref || res.data?.event_id || "OK"}`);
    } catch (err) {
      console.error("book failed", err);
      setMessage("Booking failed");
    }
  }

  return (
    <div className="bg-white border rounded p-4 space-y-3 max-w-xl">
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-2 rounded" />
      </div>

      <div className="flex gap-3 items-center">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border px-3 py-2 rounded" />
        <button onClick={loadSlots} className="px-3 py-2 bg-slate-600 text-white rounded">Fetch Slots</button>
      </div>

      <div>
        {slots.length === 0 ? <div className="text-sm text-slate-400">No slots — fetch for chosen date</div> : (
          <div className="grid gap-2">
            {slots.map((s) => (
              <label key={s.start} className={`p-2 border rounded flex items-center justify-between ${selectedSlot === s ? "ring-2 ring-indigo-400" : ""}`}>
                <div>
                  <div className="text-sm">{new Date(s.start).toLocaleTimeString()} — {new Date(s.end).toLocaleTimeString()}</div>
                  <div className="text-xs text-slate-500">{s.service_name || s.service_id}</div>
                </div>
                <input type="radio" name="slot" onChange={() => setSelectedSlot(s)} />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={book} className="px-4 py-2 bg-emerald-600 text-white rounded">Book</button>
        <div className="text-sm text-slate-500">{message}</div>
      </div>
    </div>
  );
}
