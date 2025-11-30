// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// simple dev logging
if (import.meta.env.DEV) {
  api.interceptors.request.use((cfg) => {
    // eslint-disable-next-line no-console
    console.debug("[api] req", cfg.method?.toUpperCase(), cfg.url, cfg.data || cfg.params || "");
    return cfg;
  });
  api.interceptors.response.use(
    (res) => {
      // eslint-disable-next-line no-console
      console.debug("[api] res", res.status, res.config.url);
      return res;
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error("[api] err", err?.response?.status, err?.response?.data || err.message);
      return Promise.reject(err);
    }
  );
}

/**
 * Attach / remove Authorization token header (Bearer).
 * Usage: setAuthToken(token) or setAuthToken(null) to remove.
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

/* ---------------------------
   Auth helpers
   --------------------------- */
export const auth = {
  // Request OTP for phone (or email)
  requestOtp: (payload) => api.post("/v1/auth/otp/request", payload),
  verifyOtp: (payload) => api.post("/v1/auth/otp/verify", payload),
  login: (payload) => api.post("/v1/auth/login", payload), // email/password
  me: () => api.get("/v1/auth/me"),
};

/* ---------------------------
   Chat helpers
   --------------------------- */
export const chat = {
  /**
   * Save one or more messages (server will append & return saved record or status)
   * body: { customer_id, agent_id, messages: [{ sender, message, message_id, timestamp? }] }
   */
  saveMessages: (body) => api.post("/v1/chat/save", body),

  /**
   * Get history for a (customer, agent) pair.
   * If agentId is null/undefined, backend may accept 'bot' or 'null' — adapt if needed.
   */
  getHistory: (customerId, agentId = null) => {
    if (!customerId) return Promise.reject(new Error("customerId required"));
    const agentSegment = agentId ? `/${encodeURIComponent(agentId)}` : "/bot";
    return api.get(`/v1/chat/history/${encodeURIComponent(customerId)}${agentSegment}`);
  },

  /**
   * Optional: get all customer IDs an agent has interacted with
   */
  customersForAgent: (agentId) => api.get(`/v1/chat/customers_for_agent/${encodeURIComponent(agentId)}`),
};

/* ---------------------------
   Scheduling helpers
   --------------------------- */
export const schedule = {
  // fetch available slots for given date (format depends on backend, e.g. YYYY-MM-DD)
  fetchSlots: (params = {}) => api.get("/v1/schedule/slots", { params }),

  // create a booking in third-party calendar/system
  book: (payload) => api.post("/v1/schedule/book", payload),

  // reschedule: backend may accept booking_ref + new start/end
  reschedule: (payload) => api.post("/v1/schedule/reschedule", payload),

  // cancel booking
  cancel: (payload) => api.post("/v1/schedule/cancel", payload),

  // fetch bookings for an email/customer (used in update/reschedule flow)
  fetchBookingsByEmail: (email) => api.get("/v1/schedule/bookings", { params: { email } }),
};

/* ---------------------------
   Summary / AI helpers
   --------------------------- */
export const summary = {
  // Fetch summary for a customer (optional agentId and date range)
  get: ({ customerId, agentId = null, start = null, end = null } = {}) => {
    if (!customerId) return Promise.reject(new Error("customerId required"));
    const path = agentId
      ? `/v1/summary/${encodeURIComponent(customerId)}/${encodeURIComponent(agentId)}`
      : `/v1/summary/${encodeURIComponent(customerId)}`;
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    return api.get(path, { params });
  },

  // Request generation (force refresh)
  generate: (payload) => api.post("/v1/summary/generate", payload),
};

/* ---------------------------
   SalesIQ / webhook helpers (if needed from frontend)
   --------------------------- */
export const salesiq = {
  // If you need to forward test payloads to SalesIQ webhook route
  testWebhook: (payload) => api.post("/v1/salesiq/webhook/test", payload),
};

export default api;
