import { proxyToZoho } from "../../../lib/zoho-brochure.js";

export const config = { api: { bodyParser: false } };

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export default async function handler(req, res) {
  const segments = [].concat(req.query.path || []).filter(Boolean);
  const path = "/" + segments.join("/");
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
