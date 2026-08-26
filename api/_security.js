import crypto from "node:crypto";
import dns from "node:dns/promises";
import net from "node:net";

const SESSION_COOKIE = "ghost_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const RATE_BUCKETS = globalThis.__ghostRateBuckets || new Map();
globalThis.__ghostRateBuckets = RATE_BUCKETS;

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function configuredSecret(name) {
  const value = String(process.env[name] || "").trim();
  return value.length >= 24 ? value : "";
}

function allowedOrigins() {
  const origins = new Set(
    String(process.env.GHOST_ALLOWED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim().replace(/\/$/, ""))
      .filter(Boolean)
  );

  for (const host of [process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]) {
    if (host) origins.add(`https://${String(host).replace(/^https?:\/\//, "").replace(/\/$/, "")}`);
  }

  return origins;
}

function isLocalOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]") &&
      (url.protocol === "http:" || url.protocol === "https:")
    );
  } catch {
    return false;
  }
}

export function applyCors(req, res) {
  const origin = String(req.headers?.origin || "").replace(/\/$/, "");
  const approved = !origin || isLocalOrigin(origin) || allowedOrigins().has(origin);

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (origin && approved) res.setHeader("Access-Control-Allow-Origin", origin);
  return approved;
}

export function handlePreflight(req, res) {
  if (req.method !== "OPTIONS") return false;
  if (!applyCors(req, res)) {
    res.status(403).json({ error: "Origin is not allowed." });
    return true;
  }
  res.status(204).end();
  return true;
}

function parseCookies(req) {
  return String(req.headers?.cookie || "")
    .split(";")
    .reduce((cookies, pair) => {
      const index = pair.indexOf("=");
      if (index > 0) cookies[pair.slice(0, index).trim()] = decodeURIComponent(pair.slice(index + 1).trim());
      return cookies;
    }, {});
}

function signSession(payload) {
  const secret = configuredSecret("GHOST_SESSION_SECRET");
  if (!secret) return "";
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function createSessionCookie(req) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const value = signSession(`v1.${expires}`);
  if (!value) return "";
  const secure = String(req.headers?.["x-forwarded-proto"] || "").split(",")[0].trim() === "https";
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? "; Secure" : ""}`;
}

export function hasValidSession(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(token, signSession(`v1.${expires}`));
}

function clientAddress(req) {
  return String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim()
    .slice(0, 100);
}

export function enforceRateLimit(req, res, scope, options = {}) {
  const requestedLimit = Number(options.limit || process.env.GHOST_AI_RATE_LIMIT || 30);
  const requestedWindow = Number(options.windowMs || 60 * 60 * 1000);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.floor(requestedLimit) : 30;
  const windowMs = Number.isFinite(requestedWindow) && requestedWindow > 0 ? requestedWindow : 60 * 60 * 1000;
  const now = Date.now();
  const key = `${scope}:${clientAddress(req)}`;
  const bucket = RATE_BUCKETS.get(key);
  const active = bucket && bucket.resetAt > now ? bucket : { count: 0, resetAt: now + windowMs };
  active.count += 1;
  RATE_BUCKETS.set(key, active);

  res.setHeader("RateLimit-Limit", String(limit));
  res.setHeader("RateLimit-Remaining", String(Math.max(0, limit - active.count)));
  res.setHeader("RateLimit-Reset", String(Math.ceil(active.resetAt / 1000)));

  if (active.count <= limit) return true;
  res.setHeader("Retry-After", String(Math.max(1, Math.ceil((active.resetAt - now) / 1000))));
  res.status(429).json({ error: "AI request limit reached. Try again later." });
  return false;
}

export function requireApiAccess(req, res, scope) {
  if (!applyCors(req, res)) {
    res.status(403).json({ error: "Origin is not allowed." });
    return false;
  }
  if (!hasValidSession(req)) {
    res.status(401).json({ error: "Authentication required." });
    return false;
  }
  return enforceRateLimit(req, res, scope);
}

export function requireJsonPost(req, res, maxBytes = 64 * 1024) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed." });
    return false;
  }
  const contentType = String(req.headers?.["content-type"] || "").toLowerCase();
  if (!contentType.startsWith("application/json")) {
    res.status(415).json({ error: "Content-Type must be application/json." });
    return false;
  }
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ error: "A valid JSON object is required." });
    return false;
  }
  if (Buffer.byteLength(JSON.stringify(req.body), "utf8") > maxBytes) {
    res.status(413).json({ error: "Request body is too large." });
    return false;
  }
  return true;
}

export function safeProviderError(res, status, fallback) {
  const safeStatus = status === 429 ? 429 : status >= 400 && status < 500 ? 502 : 502;
  return res.status(safeStatus).json({ error: fallback });
}

function blockedIpv4(address) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function blockedIp(address) {
  const normalized = String(address).toLowerCase().split("%")[0];
  if (net.isIPv4(normalized)) return blockedIpv4(normalized);
  if (!net.isIPv6(normalized)) return true;
  if (normalized === "::" || normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd") || /^fe[89ab]/.test(normalized)) return true;
  if (normalized.startsWith("ff") || normalized.startsWith("fec") || normalized.startsWith("fed") || normalized.startsWith("fee") || normalized.startsWith("fef")) return true;
  const mapped = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return blockedIpv4(mapped[1]);
  const mappedHex = normalized.match(/::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (mappedHex) {
    const high = Number.parseInt(mappedHex[1], 16);
    const low = Number.parseInt(mappedHex[2], 16);
    return blockedIpv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`);
  }
  if (normalized.startsWith("::")) return true;
  return false;
}

export async function validatePublicUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl).trim());
  } catch {
    throw new Error("INVALID_SOURCE_URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("UNSAFE_SOURCE_URL");
  if (url.username || url.password) throw new Error("UNSAFE_SOURCE_URL");
  const hostname = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost")) throw new Error("UNSAFE_SOURCE_URL");

  if (net.isIP(hostname)) {
    if (blockedIp(hostname)) throw new Error("UNSAFE_SOURCE_URL");
  } else {
    let addresses;
    try {
      addresses = await dns.lookup(hostname, { all: true, verbatim: true });
    } catch {
      throw new Error("SOURCE_HOST_UNAVAILABLE");
    }
    if (!addresses.length || addresses.some(({ address }) => blockedIp(address))) throw new Error("UNSAFE_SOURCE_URL");
  }
  return url;
}

async function readLimitedText(response, maxBytes) {
  const declared = Number(response.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new Error("SOURCE_TOO_LARGE");
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new Error("SOURCE_TOO_LARGE");
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

export async function fetchPublicText(rawUrl, options = {}) {
  const maxRedirects = Number(options.maxRedirects || 3);
  const maxBytes = Number(options.maxBytes || 1024 * 1024);
  const timeoutMs = Number(options.timeoutMs || 8000);
  let current = await validatePublicUrl(rawUrl);

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "GhostMediaAI/1.0", Accept: "text/html,text/plain;q=0.9" }
      });
    } catch {
      clearTimeout(timer);
      throw new Error("SOURCE_FETCH_FAILED");
    }

    if (response.status >= 300 && response.status < 400) {
      clearTimeout(timer);
      if (redirectCount === maxRedirects) throw new Error("TOO_MANY_REDIRECTS");
      const location = response.headers.get("location");
      if (!location) throw new Error("UNSAFE_REDIRECT");
      current = await validatePublicUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) {
      clearTimeout(timer);
      throw new Error("SOURCE_FETCH_FAILED");
    }
    const contentType = String(response.headers.get("content-type") || "").toLowerCase();
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      clearTimeout(timer);
      throw new Error("UNSUPPORTED_SOURCE_TYPE");
    }
    try {
      return { text: await readLimitedText(response, maxBytes), finalUrl: current.toString() };
    } catch (error) {
      if (error?.name === "AbortError") throw new Error("SOURCE_FETCH_FAILED");
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("SOURCE_FETCH_FAILED");
}

export function publicSourceError(error) {
  const unsafe = new Set(["INVALID_SOURCE_URL", "UNSAFE_SOURCE_URL", "UNSAFE_REDIRECT"]);
  if (unsafe.has(error?.message)) return { status: 400, message: "That source URL is not allowed." };
  if (error?.message === "SOURCE_TOO_LARGE") return { status: 413, message: "That source page is too large." };
  if (error?.message === "UNSUPPORTED_SOURCE_TYPE") return { status: 415, message: "Source must be an HTML or plain-text page." };
  return { status: 422, message: "Ghost Media could not safely read that source URL." };
}
