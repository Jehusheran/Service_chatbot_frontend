// src/utils/date.js
// Minimal date utilities using date-fns (stable APIs only)

import { format, parseISO, addMinutes as addMins } from "date-fns";

/**
 * Format a date string or Date object into YYYY-MM-DD (for inputs)
 */
export function toInputDate(date) {
  try {
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(d, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

/**
 * Format a date string or Date object into HH:mm (for time inputs)
 */
export function toInputTime(date) {
  try {
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(d, "HH:mm");
  } catch {
    return "";
  }
}

/**
 * Format for human display — e.g., "12 Feb 2025"
 */
export function formatDate(date) {
  try {
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(d, "dd MMM yyyy");
  } catch {
    return "";
  }
}

/**
 * Format time — e.g., "10:30 AM"
 */
export function formatTime(date) {
  try {
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(d, "hh:mm a");
  } catch {
    return "";
  }
}

/**
 * Format as "12 Feb 2025, 10:30 AM"
 */
export function formatDateTime(date) {
  try {
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(d, "dd MMM yyyy, hh:mm a");
  } catch {
    return "";
  }
}

/**
 * Add minutes to a date
 */
export function addMinutes(date, minutes) {
  try {
    const d = typeof date === "string" ? parseISO(date) : new Date(date);
    return addMins(d, minutes);
  } catch {
    return date;
  }
}

/**
 * Safe parse date
 */
export function parseDate(value) {
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}
