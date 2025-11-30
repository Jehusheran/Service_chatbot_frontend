// src/main.jsx
import React, { createContext, useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App";
import Preloader from "./components/Preloader";
import ChatLauncher from "./components/ChatLauncher";
import "./index.css"; // Tailwind / global styles

// Build API base URL from env (Vite exposes VITE_ prefixed vars)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create a single axios instance used across the app
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach simple request/response logging in development
if (import.meta.env.DEV) {
  api.interceptors.request.use((cfg) => {
    // eslint-disable-next-line no-console
    console.debug("[api] request", cfg.method?.toUpperCase(), cfg.url, cfg.data || cfg.params || "");
    return cfg;
  });
  api.interceptors.response.use(
    (res) => {
      // eslint-disable-next-line no-console
      console.debug("[api] response", res.status, res.config.url);
      return res;
    },
    (err) => {
      // eslint-disable-next-line no-console
      console.error("[api] response error", err?.response?.status, err?.response?.data || err.message);
      return Promise.reject(err);
    }
  );
}

// Provide API instance via context for easy injection in components
export const ApiContext = createContext(api);

/**
 * setAuthToken(token)
 * - token: JWT string or null to remove
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

function RootApp() {
  const apiValue = useMemo(() => api, []);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    // small helper to remove any static preloader element we put in index.html
    function removeStaticPreloader() {
      const el = document.getElementById("preloader-root");
      if (el) {
        try {
          el.style.transition = "opacity 300ms ease";
          el.style.opacity = "0";
          setTimeout(() => {
            el.remove();
          }, 320);
        } catch {
          el.remove();
        }
      }
    }

    async function checkHealth() {
      setChecking(true);
      try {
        // timeout-safe health check
        const res = await api.get("/healthz");
        if (mounted && res && res.status === 200) {
          removeStaticPreloader();
          setReady(true);
        } else {
          // still mark ready: we don't want a broken app stuck forever.
          removeStaticPreloader();
          setReady(true);
        }
      } catch (err) {
        // If backend unreachable, we still remove the static preloader and show the app
        // so user sees meaningful UI and error states.
        // eslint-disable-next-line no-console
        console.warn("Health check failed:", err?.message || err);
        removeStaticPreloader();
        setReady(true);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    // Give the browser a tiny moment to paint the static preloader, then run health check.
    const t = setTimeout(() => checkHealth(), 150);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, []);

  // While we are checking and not ready, render the React Preloader component
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Preloader />
      </div>
    );
  }

  return (
    <ApiContext.Provider value={apiValue}>
      <App />
      {/* Chat launcher is global and always available */}
      <ChatLauncher />
    </ApiContext.Provider>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found: create an element with id='root' in index.html");
}

createRoot(container).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
