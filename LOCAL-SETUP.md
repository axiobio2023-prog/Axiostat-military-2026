# Local setup

This guide walks through running the **Axiostat Military** static site on your machine. The site is plain HTML/CSS/JS plus a small Node script for blog generation and optional Netlify Functions for leads.

---

## Prerequisites

- **Git** — to clone the repository  
- **Node.js** — use a current **LTS** release (e.g. **18.x or 20.x**). The project uses ES modules (`"type": "module"` in `package.json`) and `node-fetch` v3; avoid very old Node versions.  
- **npm** — comes with Node (used to install dependencies)  

Optional:

- **Netlify CLI** — for local redirects and testing **`/.netlify/functions/*`** the same way as production (`npm install -g netlify-cli` or use `npx netlify`)

---

## 1. Clone and install

```bash
git clone <repository-url>
cd Axiostat-military-2026
npm install
```

This installs **`node-fetch`**, which **`build.mjs`** uses to call Sanity.

---

## 2. Generate blog pages (optional)

The deploy command runs **`node build.mjs`**, which:

- Fetches blog posts from Sanity  
- Writes **`blogs.html`**  
- Writes **`blog/<slug>/index.html`** for each post  

To match production locally:

```bash
node build.mjs
```

Requirements:

- Network access to `https://qt1vz71d.api.sanity.io`  
- If the API or dataset is unavailable, the command will fail; you can still run the site using existing committed HTML under **`blog/`**  

---

## 3. Run a local web server

Do **not** rely on opening **`index.html`** directly in the browser (`file://`). Many pages use **root-relative** URLs such as **`/assets/...`**, which break without a server.

### Option A — Static server (simplest)

From the project root:

```bash
npx serve .
```

Then open the URL printed in the terminal (often `http://localhost:3000`). Navigate to **`/`** (home), **`/contact.html`**, **`/blogs.html`**, and other pages as needed.

Alternatively:

```bash
npx http-server . -p 8080
```

### Option B — Netlify Dev (redirects + functions)

Mirrors **`netlify.toml`**, **`_redirects`**, and Netlify Functions:

```bash
npx netlify dev
```

Use this when you need:

- **`_redirects`** behavior (e.g. `/blog` → `/blogs`)  
- **`POST /.netlify/functions/lead`** during form testing  

---

## 4. Environment variables (Netlify Functions)

**`netlify/functions/lead.js`** expects secrets and config via environment variables (Zoho Web-to-Lead, CORS, rate limits, etc.). They are **not** committed (see **`.gitignore`** for `.env`).

For local testing with **`netlify dev`**, create a **`.env`** in the project root (same folder as **`netlify.toml`**) with the variables your team uses in the Netlify dashboard, for example:

- `ZOHO_XNQSJSDP`, `ZOHO_XMIWTLD`, `ZOHO_ACTIONTYPE`  
- `ZOHO_API_BASE` (defaults in code point at Zoho India; adjust per region if needed)  
- `ALLOWED_ORIGIN`, `RATE_WINDOW`, `RATE_MAX`  
- `SECONDARY_LEAD_SOURCE_VALUE`, `AXIO_ZOHO_RETURN_URL`  

Never commit **`.env`** or real secrets.

---

## 5. Scripts reference

| Command | Purpose |
|--------|---------|
| `npm install` | Install dependencies listed in **`package.json`** |
| `node build.mjs` | Regenerate **`blogs.html`** and **`blog/<slug>/`** from Sanity |

There are no **`npm run start`** or **`npm run build`** scripts in this repo today; deploy uses **`node build.mjs`** directly (see **`netlify.toml`**).

---

## 6. What to verify after setup

1. **Home**: `http://localhost:<port>/` or `/index.html`  
2. **Assets**: Images and CSS load (check DevTools Network for 404s on **`/assets/...`**)  
3. **Blogs**: Open **`/blogs.html`** or a generated **`/blog/<slug>/`** path  
4. **Forms**: Main enquiry flows post to **`/`** (Netlify Forms); full behavior may only work on Netlify or with **`netlify dev`**  

---

## 7. Troubleshooting

| Issue | Likely cause |
|--------|----------------|
| CSS/JS 404, layout broken | Using **`file://`** or wrong server root; serve from **repository root** |
| **`node build.mjs`** errors | Network, Sanity outage, or API changes; confirm with browser or `curl` to the query URL |
| Lead function fails locally | Missing **`.env`** or not using **`netlify dev`** |
| Regional pages look wrong | Some folders use **`/assets/...`**; server must serve from repo root |

---

## 8. Related docs

- **`DEVELOPER-GUIDE.md`** — overall architecture and where to change features  
- **`SANITY.md`** — how Sanity connects to **`build.mjs`** and HTML pages  

When you are done with local changes, commit HTML/CSS/JS (and regenerated blog files if you ran **`build.mjs`**) following your team’s workflow.
