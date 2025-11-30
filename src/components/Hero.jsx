// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center gap-12">
        <div className="max-w-2xl fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Smart Service Chatbot for Teams</h1>
          <p className="mt-4 text-lg text-slate-600">
            WhatsApp-style, company-controlled messaging — agents, bot assistance, manager AI summaries, and calendar booking.
            Plug Google Calendar or your favorite scheduler and start booking right from chat.
          </p>

          <div className="mt-8 flex gap-3">
            <Link to="/customer" className="inline-flex items-center px-5 py-3 rounded-md bg-indigo-600 text-white font-medium shadow hover:opacity-95">
              Start Chatting
            </Link>
            <Link to="/booking" className="inline-flex items-center px-5 py-3 rounded-md border border-slate-200 text-slate-700">
              Book a Demo
            </Link>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            Trusted by teams for healthcare, retail, and service desks.
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <div className="w-[520px] p-6 bg-white rounded-xl shadow-lg chat-launcher">
            <div className="text-sm text-slate-500">Demo chat preview</div>
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-indigo-600 text-white self-end max-w-[80%]">Hello! How can I help you today?</div>
              <div className="p-3 rounded-lg bg-white border max-w-[70%]">I want to book an appointment for dentist</div>
              <div className="p-3 rounded-lg bg-indigo-600 text-white self-end max-w-[80%]">Sure — when would you like to come in?</div>
            </div>
            <div className="mt-4 border-t pt-3 text-xs text-slate-400">Agent + Bot demo • Powered by Service Chatbot</div>
          </div>
        </div>
      </div>
    </section>
  );
}
