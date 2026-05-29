/**
 * Resolve API base URL for local dev and hosted frontends (Vercel, custom domain).
 * CRA bakes REACT_APP_* at build time; if production build still points at localhost,
 * we fall back to the deployed backend when the app runs on a non-local hostname.
 */
const LOCAL_API = "http://localhost:5000/api";
const DEFAULT_PROD_API = "https://poly-code-backend.vercel.app/api";

function normalizeBase(url = "") {
  return url.trim().replace(/\/$/, "");
}

function isLocalHostname(hostname = "") {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isLocalApiUrl(url = "") {
  return /localhost|127\.0\.0\.1/.test(url);
}

export function getApiBase() {
  const envUrl = normalizeBase(process.env.REACT_APP_API_URL || "");
  const prodOverride = normalizeBase(process.env.REACT_APP_PROD_API_URL || "");

  if (typeof window === "undefined") {
    return envUrl || LOCAL_API;
  }

  const { hostname } = window.location;

  if (isLocalHostname(hostname)) {
    return envUrl || LOCAL_API;
  }

  if (envUrl && !isLocalApiUrl(envUrl)) {
    return envUrl;
  }

  return prodOverride || DEFAULT_PROD_API;
}
