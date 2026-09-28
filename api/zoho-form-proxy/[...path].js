import { proxyToZoho, zohoPath } from "../../lib/zoho-brochure.js";

export const config = { api: { bodyParser: false } };

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

function resolvePath(req) {
  const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
  const fromUrl = zohoPath(url.pathname);
  if (fromUrl) return fromUrl;

  const segments = [].concat(req.query.path || []).filter(Boolean);
  const joined = "/" + segments.map((part) => decodeURIComponent(String(part))).join("/");
  const fromQuery = zohoPath(joined);
  if (fromQuery) return fromQuery;
  if (segments.length && !joined.includes("..")) {
    const prefixed = joined.startsWith("/axiobio41/") ? joined : `/axiobio41${joined}`;
    const found = zohoPath(prefixed);
    if (found) return found;
  }
  return url.pathname;
}

export default async function handler(req, res) {
  const path = resolvePath(req);
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const result = await proxyToZoho({
    method: req.method,
    path,
    search: url.search,
    headers: req.headers,
    body: await readBody(req),
  });

  for (const [key, value] of Object.entries(result.headers || {})) {
    res.setHeader(key, value);
  }
  res.status(result.status).send(result.body);
}
