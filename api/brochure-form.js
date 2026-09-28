import { getThemedFormHtml } from "../lib/zoho-brochure.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).setHeader("Content-Type", "text/plain").send("Method not allowed");
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const result = await getThemedFormHtml(url.searchParams);
  for (const [key, value] of Object.entries(result.headers || {})) {
    res.setHeader(key, value);
  }
  res.status(result.status).send(req.method === "HEAD" ? "" : result.body);
}
