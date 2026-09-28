import { getThemedFormHtml } from "../../lib/zoho-brochure.js";

export async function handler(event) {
  if (event.httpMethod !== "GET" && event.httpMethod !== "HEAD") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  const params = new URLSearchParams(event.rawQuery || "");
  const result = await getThemedFormHtml(params);
  return {
    statusCode: result.status,
    headers: result.headers,
    body: event.httpMethod === "HEAD" ? "" : result.body,
  };
}
