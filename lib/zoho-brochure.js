const ZOHO_ORIGIN = "https://forms.zohopublic.in";
const ZOHO_FORM =
  "https://forms.zohopublic.in/axiobio41/form/RequestBrochure1/formperma/A2C6ETkhlU0u_wucyOiBo8A5sUgIlnjfhswXTlZ_fpM";
const FORM_REFERER = ZOHO_FORM;

const THEME_CSS = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;0,500;0,600;0,700;1,600;1,700&display=swap" />
<style id="axiostat-brochure-theme">
  :root {
    --body-font: "Kanit", sans-serif !important;
    --header-font: "Kanit", sans-serif !important;
    --title-txt-clr: #ad8f6c !important;
    --submit-bg-clr: 173, 143, 108 !important;
    --input-focus-clr: #ad8f6c !important;
  }
  body,
  input,
  textarea,
  select,
  button,
  label,
  .fieldlabel,
  .zfFormHeader h2,
  .zfbtnSubmit {
    font-family: "Kanit", sans-serif !important;
  }
  .zfFormHeader h2 {
    color: #ad8f6c !important;
    font-weight: 700 !important;
    font-style: italic !important;
  }
  .important {
    color: #ad8f6c !important;
  }
  .zfbtnSubmit,
  .btnElem.zfbtnSubmit {
    background: #ad8f6c !important;
    background-color: #ad8f6c !important;
    border: 2px solid #ad8f6c !important;
    color: #fff !important;
    border-radius: 6px !important;
    font-weight: 600 !important;
    font-style: italic !important;
    font-size: 17px !important;
    letter-spacing: 0.01em;
    box-shadow: none !important;
  }
  .zfbtnSubmit:hover,
  .btnElem.zfbtnSubmit:hover {
    background: #9c7e5d !important;
    background-color: #9c7e5d !important;
    border-color: #9c7e5d !important;
    color: #fff !important;
  }
  input:focus,
  textarea:focus,
  select:focus {
    border-color: #ad8f6c !important;
    outline-color: #ad8f6c !important;
  }
  html,
  body,
  .backgroundBg,
  .bgWrapper,
  .mainWrapper,
  .fieldContWrapper,
  .centerContainer {
    background: #fff !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    min-height: 0 !important;
    height: auto !important;
  }
  .fieldContWrapper {
    margin: 0 !important;
    padding: 8px 12px 4px !important;
    width: 100% !important;
    max-width: none !important;
  }
  .centerContainer {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
  }
  .zfFormHeader,
  .formHeaderInside {
    margin: 4px 8px 0 !important;
  }
  .navBtnWrapper,
  .zfFooter {
    margin: 4px 12px 8px !important;
  }
  [elname="errMsg"],
  .thankyouMsgText,
  .infoContainer {
    overflow-wrap: anywhere;
    word-break: break-word;
    max-width: 100%;
  }
  [elname="liveErrPageDiv"],
  .tyTemplateWidth,
  .tyTemplateWrapper,
  .infoWrapper,
  .infoContainer {
    max-width: 100% !important;
    box-sizing: border-box;
  }
  body.thankyouPageWrap,
  .thankyouPageWrap,
  .thankyouPageWrap .backgroundBg,
  .thankyouPageWrap .backgroundSecBg,
  .thankyouPageWrap .tyTemplateWrapper,
  .thankyouPageWrap .templateWrapper,
  .thankyouPageWrap.layout3 .centerContainer,
  .thankyouPageWrap.grad_formCont.layout3 .centerContainer,
  .thankyouPageWrap .centerContainer,
  .tyTemplateWidth .centerContainer,
  .thankyouPageWrap .infoWrapper,
  .thankyouPageWrap .infoContainer {
    background: #fff !important;
    background-image: none !important;
    box-shadow: none !important;
    border: 0 !important;
    border-radius: 0 !important;
  }
  .tyTemplateWidth,
  .ofliveErrMsgWrapper .tyTemplateWidth,
  .thankyouPageWrap .tyTemplateWidth,
  .thankyouPageWrap .centerContainer,
  .backgroundSecBg.thankyouPageFocusCont,
  .backgroundSecBg.thankyouPageFocusCont.jsEmbedResizeTyPage {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 28px 16px 16px !important;
    align-items: flex-start !important;
    justify-content: center !important;
  }
  .thankyouMsgText,
  .thankyouPageWrap,
  .infoContainer {
    font-family: "Kanit", sans-serif !important;
    color: #222 !important;
  }
  .thankyouTick {
    stroke: #243040 !important;
  }
  .icon-thankyou-tick {
    fill: #243040 !important;
    color: #243040 !important;
  }
  .newEntryLink a,
  .thankyouPageBtn a,
  .thankyouPageWrap .newEntryLink a,
  .thankyouPageWrap a.btnElem {
    background: #ad8f6c !important;
    background-color: #ad8f6c !important;
    background-image: none !important;
    border: 2px solid #ad8f6c !important;
    color: #fff !important;
    fill: #fff !important;
    border-radius: 6px !important;
    font-family: "Kanit", sans-serif !important;
    font-weight: 600 !important;
    font-style: italic !important;
    font-size: 17px !important;
    box-shadow: none !important;
    text-decoration: none !important;
  }
  .newEntryLink a:hover,
  .thankyouPageBtn a:hover,
  .thankyouPageWrap .newEntryLink a:hover,
  .thankyouPageWrap a.btnElem:hover {
    background: #9c7e5d !important;
    background-color: #9c7e5d !important;
    border-color: #9c7e5d !important;
    color: #fff !important;
  }
</style>
<script>
(function () {
  var FRIENDLY_ERROR = "Something went wrong while submitting the form. Please try again.";
  function looksLikeHtmlError(text) {
    return /<!DOCTYPE html>|Page Not Found|#message h2|<html>/i.test(text || "");
  }
  function sanitizeErrors() {
    var nodes = document.querySelectorAll('[elname="errMsg"], .thankyouMsgText, .zfErrorDiv, .infoContainer p, .infoContainer span');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = (el.textContent || "").replace(/\\s+/g, " ").trim();
      if (looksLikeHtmlError(text)) el.textContent = FRIENDLY_ERROR;
    }
  }
  function formHeight() {
    if (document.body && document.body.classList.contains("thankyouPageWrap")) {
      var nodes = document.querySelectorAll(".infoContainer, .tyTemplateWrapper");
      var thanksHeight = 0;
      for (var i = 0; i < nodes.length; i++) {
        thanksHeight = Math.max(thanksHeight, Math.ceil(nodes[i].getBoundingClientRect().height));
      }
      return Math.max(thanksHeight + 48, 240);
    }
    var el = document.querySelector(".fieldContWrapper") || document.body;
    return Math.ceil(el.getBoundingClientRect().height);
  }
  function sendHeight() {
    sanitizeErrors();
    if (!window.parent || window.parent === window) return;
    window.parent.postMessage({ type: "axiostat-brochure-height", height: formHeight() }, window.location.origin);
  }
  var nativeOpen = window.open;
  function openGuard(url, target, features) {
    var address = String(url || "");
    var parsed;
    try { parsed = new URL(address, window.location.href); } catch (e) { parsed = null; }
    var href = parsed ? parsed.href : address;
    var sameWindow = target === "_self" || target === "_parent" || target == null;
    if (sameWindow && /thankyou|thank-you/i.test(href)) {
      window.location.replace("/request-brochure-thanks" + (window.location.search || ""));
      return null;
    }
    return nativeOpen.call(window, url, target, features);
  }
  window.open = openGuard;
  window.addEventListener("load", function () {
    window.open = openGuard;
    sendHeight();
  });
  window.addEventListener("resize", sendHeight);
  if (document.documentElement) {
    new MutationObserver(sendHeight).observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  setTimeout(sendHeight, 200);
  setTimeout(sendHeight, 800);
})();
</script>
`;

function themeHtml(html) {
  let next = html
    .replace(/--body-font:\s*[^;]+;/g, '--body-font: "Kanit", sans-serif;')
    .replace(/--header-font:\s*[^;]+;/g, '--header-font: "Kanit", sans-serif;')
    .replace(/--title-txt-clr:\s*[^;]+;/g, "--title-txt-clr: #ad8f6c;")
    .replace(/--submit-bg-clr:\s*[^;]+;/g, "--submit-bg-clr: 173, 143, 108;")
    .replace(/--input-focus-clr:\s*[^;]+;/g, "--input-focus-clr: #ad8f6c;");

  if (next.includes("</head>")) {
    next = next.replace("</head>", THEME_CSS + "</head>");
  } else {
    next = THEME_CSS + next;
  }
  return next;
}

function headerValue(headers, name) {
  if (!headers) return "";
  const want = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (String(key).toLowerCase() === want) {
      return Array.isArray(value) ? value.join(",") : value || "";
    }
  }
  return "";
}

function zohoPath(pathname) {
  const match = String(pathname || "").match(
    /\/axiobio41\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*/
  );
  if (!match) return null;
  const found = match[0];
  if (found.includes("..") || found.includes("\\")) return null;
  return found;
}

async function getThemedFormHtml(searchParams) {
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  };
  const url = new URL(ZOHO_FORM);
  const referrer = searchParams && searchParams.get && searchParams.get("referrername");
  if (referrer) url.searchParams.set("referrername", String(referrer).slice(0, 1800));

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html", "User-Agent": "AxiostatBrochure/1.0" },
    });
    const html = await response.text();
    if (!response.ok || (!html.includes("zfbtnSubmit") && !html.includes(":root"))) {
      return {
        status: 502,
        headers,
        body: "<p>The brochure form is unavailable. Please try again.</p>",
      };
    }
    return { status: 200, headers, body: themeHtml(html) };
  } catch {
    return {
      status: 502,
      headers,
      body: "<p>The brochure form is unavailable. Please try again.</p>",
    };
  }
}

async function proxyToZoho({ method, path, search, headers, body }) {
  const zoho = zohoPath(path);
  if (!zoho) {
    return { status: 404, headers: { "Content-Type": "text/plain" }, body: "Not found" };
  }

  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  params.delete("path");
  params.delete("zfpath");
  const query = params.toString() ? "?" + params.toString() : "";
  const target = ZOHO_ORIGIN + zoho + query;

  const outgoing = {
    Accept: headerValue(headers, "accept") || "*/*",
    "User-Agent": headerValue(headers, "user-agent") || "AxiostatBrochure/1.0",
    Origin: ZOHO_ORIGIN,
    Referer: FORM_REFERER,
  };
  const contentType = headerValue(headers, "content-type");
  if (contentType) outgoing["Content-Type"] = contentType;

  const init = { method, headers: outgoing, redirect: "manual" };
  if (method !== "GET" && method !== "HEAD" && body != null && body !== "") {
    init.body = body;
  }

  try {
    const response = await fetch(target, init);
    const buffer = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get("content-type") || "application/octet-stream";
    const themedThanks = /text\/html/i.test(type) && /thankyou/i.test(zoho);
    return {
      status: response.status,
      headers: {
        "Content-Type": themedThanks ? "text/html; charset=utf-8" : type,
        "Cache-Control": "no-store",
      },
      body: themedThanks ? themeHtml(buffer.toString("utf8")) : buffer,
    };
  } catch {
    return {
      status: 502,
      headers: { "Content-Type": "text/plain" },
      body: "Brochure form request failed",
    };
  }
}

export {
  FORM_REFERER,
  THEME_CSS,
  ZOHO_FORM,
  ZOHO_ORIGIN,
  getThemedFormHtml,
  proxyToZoho,
  themeHtml,
  zohoPath,
};
