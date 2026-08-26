import {
  applyCors,
  createSessionCookie,
  enforceRateLimit,
  handlePreflight,
  requireJsonPost
} from "./_security.js";
import crypto from "node:crypto";

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!applyCors(req, res)) return res.status(403).json({ error: "Origin is not allowed." });
  if (!enforceRateLimit(req, res, "session", { limit: 10, windowMs: 15 * 60 * 1000 })) return;
  if (!requireJsonPost(req, res, 2048)) return;

  const configuredKey = String(process.env.GHOST_ACCESS_KEY || "").trim();
  const sessionSecret = String(process.env.GHOST_SESSION_SECRET || "").trim();
  if (configuredKey.length < 16 || sessionSecret.length < 24) {
    return res.status(503).json({ error: "Ghost Media access is not configured." });
  }

  const accessKey = typeof req.body.accessKey === "string" ? req.body.accessKey : "";
  if (!safeEqual(accessKey, configuredKey)) {
    return res.status(401).json({ error: "Invalid access key." });
  }

  const cookie = createSessionCookie(req);
  if (!cookie) return res.status(503).json({ error: "Ghost Media access is not configured." });
  res.setHeader("Set-Cookie", cookie);
  return res.status(204).end();
}
