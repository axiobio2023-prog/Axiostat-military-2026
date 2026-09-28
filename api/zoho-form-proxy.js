import { proxyToZoho, zohoPath } from "../lib/zoho-brochure.js";

export const config = { api: { bodyParser: false } };

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

function candidatePath(value) {
  if (!value) return "";
  let text = Array.isArray(value) ? value.join("/") : String(value);
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(text);
      if (decoded === text) break;
      text = decoded;
    } catch {
      break;
    }
  }
  if (!text.startsWith("/")) text = `/${text}`;
  if (!text.startsWith("/axiobio41/")) text = `/axiobio41${text}`;
  return zohoPath(text) || "";
}

function resolvePath(req) {
  const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
  const headers = req.headers || {};
  return (
    candidatePath(req.query && req.query.zfpath) ||
    candidatePath(headers["x-forwarded-uri"]) ||
    candidatePath(headers["x-original-uri"]) ||
    zohoPath(url.pathname) ||
    candidatePath(req.query && req.query.path) ||
    ""
  );
}

export default async function handler(req, res) {
  const path = resolvePath(req);
  const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
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
