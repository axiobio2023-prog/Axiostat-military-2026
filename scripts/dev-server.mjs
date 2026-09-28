import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getThemedFormHtml, proxyToZoho } from "../lib/zoho-brochure.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

function safeFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded.replace(/^\/+/, "");
  const filePath = path.resolve(ROOT, relative || "index.html");
  if (!filePath.startsWith(ROOT)) return null;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
  if (fs.existsSync(filePath + ".html") && fs.statSync(filePath + ".html").isFile()) {
    return filePath + ".html";
  }
  const indexFile = path.join(filePath, "index.html");
  if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) return indexFile;
  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/request-brochure" || url.pathname === "/request-brochure/") {
      const result = await getThemedFormHtml(url.searchParams);
      send(res, result.status, result.headers, req.method === "HEAD" ? "" : result.body);
      return;
    }

    if (url.pathname.startsWith("/axiobio41/")) {
      const result = await proxyToZoho({
        method: req.method,
        path: url.pathname,
        search: url.search,
        headers: req.headers,
        body: await readBody(req),
      });
      send(res, result.status, result.headers, result.body);
      return;
    }

    const filePath = safeFile(url.pathname === "/" ? "/index.html" : url.pathname);
    if (!filePath) {
      const fallback = path.join(ROOT, "404.html");
      const body = fs.existsSync(fallback)
        ? fs.readFileSync(fallback)
        : "Not found";
      send(res, 404, { "Content-Type": "text/html; charset=utf-8" }, body);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, { "Content-Type": MIME[ext] || "application/octet-stream" }, fs.readFileSync(filePath));
  } catch (error) {
    send(res, 500, { "Content-Type": "text/plain" }, String(error && error.message));
  }
});

server.listen(PORT, () => {
  console.log(`Axiostat local server: http://localhost:${PORT}`);
  console.log("Brochure form proxy is enabled at /request-brochure and /axiobio41/*");
});
