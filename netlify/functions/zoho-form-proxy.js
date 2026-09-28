import { proxyToZoho, zohoPath } from "../../lib/zoho-brochure.js";

export { zohoPath };

function incomingPath(event) {
  const headers = event.headers || {};
  const candidates = [
    event.rawUrl,
    event.originalPath,
    headers["x-nf-request-path"] || headers["X-Nf-Request-Path"],
    headers["x-forwarded-uri"] || headers["X-Forwarded-Uri"],
    event.path,
  ];
  for (const candidate of candidates) {
    if (zohoPath(candidate)) return candidate;
  }
  return event.rawUrl || event.path || "";
}

export async function handler(event) {
  const result = await proxyToZoho({
    method: event.httpMethod,
    path: incomingPath(event),
    search: event.rawQuery ? "?" + event.rawQuery : "",
    headers: event.headers,
    body: event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : event.body,
  });
  const body = Buffer.isBuffer(result.body) ? result.body : Buffer.from(result.body || "");
  const type = (result.headers && result.headers["Content-Type"]) || "";
  const isText = /json|text|xml|javascript|form-urlencoded/i.test(type);
  return {
    statusCode: result.status,
    headers: result.headers,
    isBase64Encoded: !isText,
    body: isText ? body.toString("utf8") : body.toString("base64"),
  };
}
