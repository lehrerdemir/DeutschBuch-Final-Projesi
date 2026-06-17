// src/config.js

// Backend base URL (only change here or via .env)
export const BACKEND_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

// API base URL
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

// Local demo switches. Keep true for quick classroom demo; set false for real Firebase/Stripe.
export const DEMO_AUTH = String(process.env.REACT_APP_DEMO_AUTH || "true").toLowerCase() === "true";
export const DEMO_PAYMENT = String(process.env.REACT_APP_DEMO_PAYMENT || "true").toLowerCase() === "true";

export const ADMIN_EMAILS = String(process.env.REACT_APP_ADMIN_EMAILS || "lehrerdemir@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Helper: build full image URL from DB value
export const resolveImageUrl = (pathOrUrl) => {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!pathOrUrl.startsWith("/")) pathOrUrl = `/${pathOrUrl}`;
  return `${BACKEND_BASE_URL}${pathOrUrl}`;
};

export const formatTRY = (value) => `${Number(value || 0).toFixed(2)} TL`;
export const formatCentsTRY = (cents) => `${(Number(cents || 0) / 100).toFixed(2)} TL`;
