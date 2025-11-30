// src/components/BookingPanel.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

/**
 * BookingPanel
 *
 * Props:
 *  - initialCustomer: { name, email, phone } (optional)
 *  - onBooked(booking) optional callback after successful booking
 */
export default function BookingPanel({ initialCustomer = {}, onBooked } = {}) {
  const [name, setName] = useState(initialCustomer.name || "");
  const [email, setEmail] = useState(initialCustomer.email || "");
  const [phone, setPhone] = useState(initialCustomer.phone || "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // small UI nicety: show skeleton while initial load
  useEffect(() => {
    // Optionally prefetch today's slots
    // comment out if you prefer on-demand only
  }, []);

  async function loadSlots() {
    if (!date) {
      setMessage("Please choose a date first.");
      return;
    }
    setMessage("");
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const res = await api.get("/v1/schedule/slots", { params: { date } });
      // Expected response: array of { start, end, service_id, service_name, meta... }
      const data = Array.isArray(res.data) ? res.data : (res.data?.slots || []);
      // sort by start time
      data.sort((a, b) => new Date(a.start) - new Date(b.start));
      setSlots(data);
      if ((data || []).length === 0) {
        setMessage("No slots available on this date.");
      }
    } catch (err) {
      console.error("Failed to load slots:", err);
      setMessage("Unable to fetch slots. Try again later.");
    } finally {
      setLoadingSlots(false);
    }
  }

  async function requestOtp() {
    if (!phone) {
      setMessage("Enter phone to receive OTP.");
      return;
    }
    setOtpLoading(true);
    setMessage("");
    try {
      await api.post("/v1/auth/otp/request", { phone });
      setOtpSent(true);
      setMessage("OTP sent — check your phone.");
    } catch (err) {
      console.error("OTP request failed", err);
      setMessage("Failed to send OTP. Try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function verifyOtp() {
    if (!phone || !otpCode) {
      setMessage("Enter OTP code.");
      return;
    }
    setOtpLoading(true);
    setMessage("");
    try {
      const res = await api.post("/v1/auth/otp/verify", { phone, code: otpCode });
      // server should reply with success flag; we trust 200 as verified
      setPhoneVerified(true);
      setOtpSent(false);
      setOtpCode("");
      setMessage("Phone verified ✅");
    } catch (err) {
      console.error("OTP verify failed", err);
      setMessage("OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function book() {
    if (!name || !email) {
      setMessage("Please enter name and email.");
      return;
    }
    if (!selectedSlot) {
      setMessage("Select a slot to book.");
      return;
    }
    // Ideally phone verification required for bookings that need confirmation via SMS
    // If you want to enforce: if (!phoneVerified) setMessage('Verify phone first') and return
    setBookingLoading(true);
    setMessage("");
    try {
      const payload = {
        customer: { name, email, phone },
        start: selectedSlot.start,
        end: selectedSlot.end,
        service_id: selectedSlot.service_id || "default",
        // optional idempotency key prevents duplicate bookings on retries
        idempotency_key: `bk-${selectedSlot.start}-${email}` ,
        meta: { booked_from: "frontend" },
      };
      const res = await api.post("/v1/schedule/book", payload);
      const booking = res.data || {};
      setMessage(`Booked ✓ ${booking.booking_ref || booking.event_id || "Confirmed"}`);
      if (onBooked) try { onBooked(booking); } catch (_) {}
      // optionally clear UI or keep booking visible
    } catch (err) {
      console.error("Booking failed", err);
      const errMsg = err?.response?.data?.error || "Booking failed. Try again.";
      setMessage(errMsg);
    } finally {
      setBookingLoading(false);
    }
  }

  function slotLabel(s) {
    try {
      const start = new Date(s.start);
      const end = new Date(s.end);
      return `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return `${s.start} → ${s.end}`;
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 max-w-3xl">
      <h3 className="text-lg font-semibold">Book an Appointment</h3>
      <p className="text-sm text-slate-500 mt-1">Pick a date, choose an available slot and confirm your booking.</p>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-slate-600">Name</label>
          <label className="text-xs text-slate-600">Email</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="col-span-1 px-3 py-2 border rounded" placeholder="Full name" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="col-span-1 px-3 py-2 border rounded" placeholder="you@example.com" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-600 block">Phone (optional but recommended)</label>
            <input value={phone} onChange={(e)=>{ setPhone(e.target.value); setPhoneVerified(false); }} className="w-full px-3 py-2 border rounded" placeholder="+91xxxxxxxxxx" />
          </div>

          <div className="w-48">
            <label className="text-xs text-slate-600 block">Verify phone</label>
            <div className="flex gap-2">
              {!phoneVerified ? (
                <>
                  <button onClick={requestOtp} disabled={otpLoading || !phone} className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-50">
                    {otpLoading ? "Sending…" : (otpSent ? "Resend OTP" : "Send OTP")}
                  </button>
                  {otpSent && (
                    <div className="flex items-center gap-2">
                      <input value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} placeholder="OTP" className="px-2 py-2 border rounded w-20" />
                      <button onClick={verifyOtp} disabled={otpLoading || !otpCode} className="px-2 py-2 rounded bg-emerald-600 text-white">Verify</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-emerald-600 font-medium">Verified ✓</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3 mt-2">
          <div>
            <label className="text-xs text-slate-600 block">Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="px-3 py-2 border rounded" />
          </div>
          <div>
            <button onClick={loadSlots} disabled={!date || loadingSlots} className="px-4 py-2 rounded bg-slate-700 text-white">
              {loadingSlots ? "Fetching…" : "Fetch Slots"}
            </button>
          </div>
          <div className="ml-auto text-sm text-slate-500">
            {slots.length > 0 ? `${slots.length} slots` : "No slots fetched"}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium">Available Slots</h4>
        <div className="mt-3 grid gap-3">
          {loadingSlots ? (
            // skeletons
            <>
              <div className="p-3 border rounded skeleton skel-text" />
              <div className="p-3 border rounded skeleton skel-text" />
              <div className="p-3 border rounded skeleton skel-text" />
            </>
          ) : slots.length === 0 ? (
            <div className="text-sm text-slate-400">No slots — choose a date and fetch.</div>
          ) : (
            slots.map((s) => {
              const active = selectedSlot === s;
              return (
                <button
                  key={s.start + (s.service_id||"")}
                  onClick={() => setSelectedSlot(s)}
                  className={`flex items-center justify-between p-3 rounded-md border transition-all text-left ${active ? "ring-2 ring-indigo-400 bg-indigo-50" : "hover:shadow-sm"}`}
                  aria-pressed={active}
                >
                  <div>
                    <div className="text-sm font-medium">{s.service_name || s.service_id || "Service"}</div>
                    <div className="text-xs text-slate-500">{slotLabel(s)}</div>
                  </div>
                  <div className="text-sm text-slate-600">{s.price ? `₹${s.price}` : ""}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={book} disabled={bookingLoading} className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50">
          {bookingLoading ? "Booking…" : "Confirm Booking"}
        </button>

        {/* Optional: Add a "Pay now" / payment hook here. */}
        <button onClick={() => {
          if (!selectedSlot) { setMessage("Select a slot first."); return; }
          // Payment integration placeholder (open modal / redirect to payment)
          setMessage("Payment flow not implemented in demo.");
        }} className="px-3 py-2 rounded border text-sm">Pay now</button>

        <div className="ml-auto text-sm text-slate-500">{message}</div>
      </div>
    </div>
  );
}
