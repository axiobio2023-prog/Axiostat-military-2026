# Axiostat Military — Developer guide

This document explains how the **Axiostat Military** marketing site is structured, how it is built and deployed, and which files and patterns you touch when adding or changing features.

---

## 1. What kind of project this is

This repository is a **multi-page static website**: many standalone `.html` files, shared assets under `assets/`, and **no React/Vue/Angular app**. Pages are hand-authored HTML with:

- **Bootstrap 5** for layout and components
- **jQuery** + **Owl Carousel** for carousels and small interactions
- **Custom CSS** (`main`, `responsive`, `myStyles`, …)
- **Inline `<script>` blocks** on many pages for forms, modals, and page-specific behavior

**Deployment**: [Netlify](https://netlify.com/). The repo root is the publish folder (`publish = "."` in `netlify.toml`).

**Build step**: A Node script (`build.mjs`) runs at deploy time to pull **blog posts from Sanity CMS** and generate static HTML files. Everything else is already HTML/CSS/JS in the tree.

---

## 2. Tech stack (as used in this repo)

| Layer                     | Technology                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| Runtime / tooling         | **Node.js** (ES modules: `"type": "module"` in `package.json`)                                       |
| HTTP in build             | **node-fetch** (`build.mjs`)                                                                         |
| Markup                    | **HTML** (many pages, duplicated layout patterns)                                                    |
| Styling                   | **CSS** (source + `*-minify.css` variants), **Bootstrap 5** (CDN), **Animate.css**, **Font Awesome** |
| Client JS                 | **jQuery**, **Bootstrap JS**, **Owl Carousel**, site scripts in `assets/js/`                         |
| Backend at deploy         | **Netlify Functions** (`netlify/functions/lead.js`)                                                  |
| Headless CMS (blogs only) | **Sanity** (project id embedded in `build.mjs` and some pages)                                       |

There is **no bundler** (no Webpack/Vite) in this repo: scripts and styles are linked directly.

---

## 3. Repository layout (mental map)

```
/
├── index.html                 # Home (canonical entry layout)
├── contact.html, events.html, blogs.html, …   # Top-level pages
├── germany/, uk/, uae/, qatar/, singapore/, indonesia/, france/
│   └── *.html                 # Regional copies / variants (often near-duplicates of root pages)
├── blog/
│   └── index.html             # Template used by build.mjs for generated posts
├── blogs.template.html        # Template for blogs listing; build injects cards → blogs.html
├── assets/
│   ├── css/                   # main.css, responsive.css, myStyles.css (+ *-minify.css)
│   ├── js/                    # main.js (source), main-minify.js (linked in HTML)
│   ├── graphics/, plugins/
│   └── …
├── netlify/
│   └── functions/
│       └── lead.js            # Serverless: Zoho Web-to-Lead proxy
├── build.mjs                  # Sanity → blogs.html + blog/<slug>/index.html
├── netlify.toml               # Build command, publish dir, functions folder
├── _redirects                 # Netlify redirects / SPA-style rules for /blog/*
├── sitemap.xml, robots.txt, 404.html
├── package.json               # node-fetch dependency; run build via `node build.mjs`
└── .htaccess                  # Apache rules (useful if mirrored off Netlify)
```

**Important**: Product and regional pages are often **copies** of the same structure with different paths (some use root-relative `/assets/...`, others use relative `assets/...`). Changing “the header everywhere” usually means **multiple HTML files**, not one shared component file.

---

## 4. How the site is built

### 4.1 Netlify (`netlify.toml`)

- **`[build] command`**: `node build.mjs`
- **`publish`**: `.` (entire repo root after build)
- **`functions`**: `netlify/functions`

So every deploy: install deps → run `build.mjs` → publish static files + compile/deploy functions.

### 4.2 Blog generation (`build.mjs`)

`build.mjs`:

1. Calls Sanity’s HTTP API for documents matching `*[_type=='post']`.
2. Builds **`blogs.html`** by reading **`blogs.template.html`** and replacing the `#blogSet` row with generated card markup.
3. For each post with a `slug`, writes **`blog/<slug>/index.html`** using **`blog/index.html`** as a template: injects title, meta, OG tags, header, and body HTML converted from Sanity portable text (`blocksToHtml`).
4. Normalizes asset paths in the template to root-absolute `/assets/...` for generated posts.

**Functions worth knowing** (for extending blog rendering):

- `blocksToHtml(content)` — portable text → HTML (paragraphs, links, emphasis, images).
- `imageUrl(ref)` — Sanity image ref → CDN URL.

**If you change blog card HTML or post layout**, edit **`blogs.template.html`** and/or **`blog/index.html`**, then run **`node build.mjs`** locally and commit the regenerated **`blogs.html`** and **`blog/<slug>/`** outputs (or rely on CI to regenerate on deploy).

**Credentials**: The Sanity project id and dataset are **hard-coded** in `build.mjs` (read-only public API for published content). Changing CMS project requires updating that file (and any inline `projectId` / `dataset` in HTML pages that query Sanity from the browser).

### 4.3 CSS and JS “minify” files

HTML typically references:

- `assets/css/main-minify.css`, `responsive-minify.css`, `myStyles-minify.css`
- `assets/js/main-minify.js`

Editable sources in-repo include **`main.css`**, **`responsive.css`**, **`myStyles.css`**, and **`main.js`**. There is **no npm script** wired to minify automatically; after editing sources, update the corresponding `*-minify.*` files using your usual minifier (or paste minified output), **or** switch HTML links to the non-minified assets during development only.

---

## 5. Local development

1. **Install dependencies** (once):

   ```bash
   npm install
   ```

2. **Regenerate blogs** (optional, requires network):

   ```bash
   node build.mjs
   ```

3. **Serve static files** with any static server (many pages assume HTTP paths like `/assets/...`):

   ```bash
   npx serve .
   ```

   Or use **Netlify CLI** forFunctions + redirects parity:

   ```bash
   npx netlify dev
   ```

**Note**: Opening `index.html` via `file://` can break root-relative URLs used on some regional pages.

---

## 6. Page anatomy — what to copy when adding a page

Most pages share the same building blocks:

1. **`<head>`** — meta title/description, canonical URL, Open Graph/Twitter, favicon, Bootstrap/Owl/CSS links, GTM (and sometimes Google Translate snippets).
2. **`<header class="header">`** — logo, navbar, dropdowns (Products, Regions, etc.).
3. **Main content** — Bootstrap grids, sections, carousels.
4. **Footer** — links, contact, legal.
5. **Scripts at bottom** — jQuery, Bootstrap bundle, Owl, `main-minify.js`, Font Awesome JS, then **inline scripts** (forms, trainer modal, submenu behavior).

**Fastest path for a new marketing page**: duplicate the closest existing page (e.g. `technology.html` or a product page), rename the file, update `<title>`, meta, canonical, visible copy, and navigation highlights if any.

**Regional pages** (`uk/`, `germany/`, …): match the **asset URL style** already used in that folder (`/assets/...` vs `assets/...`) and fix **internal links** (`href`) so they stay inside the regional subtree or point back to global pages consistently.

---

## 7. JavaScript behavior (`assets/js/main.js`)

`main.js` runs inside **`$(document).ready`** and mainly:

- Toggles **`.header.sticky`** after scrolling past ~200px.
- Initializes **Owl Carousel** instances for classes like `.carousel_1`, `.carousel_latest`, `.carousel_events`, `.carousel_award`, `.carousel_step`, `.carousel_subtitle`.

If you add a new carousel, **reuse an existing class pattern** or add a new `$(".your-class").owlCarousel({ ... })` block here, then refresh **`main-minify.js`** if production loads the minified file.

**Page-specific JS** (forms, Sanity `fetch`, trainer modal) lives in **inline `<script>` tags** at the bottom of individual HTML files — that is where duplicate logic often accumulates.

---

## 8. Styling (`assets/css/`)

- **`main.css`** — core layout, typography, components.
- **`responsive.css`** — breakpoints and responsive tweaks.
- **`myStyles.css` / `myStyles2.css`** — extra sections or experiments (not every page links all of them).
- **`countrySelect.min.css`** — used where country selectors appear (e.g. contact).

Prefer **scoped class names** consistent with existing utilities (`b_600`, `color1`, etc.) rather than fighting Bootstrap. After edits, mirror changes into **`*-minify.css`** if those are what production HTML references.

---

## 9. Forms and lead capture

There are **multiple patterns** in this codebase:

### 9.1 Netlify Forms (main enquiry form)

Many pages use `<form id="enquiryForm" data-netlify="true">` and submit via:

```js
fetch("/", { method: "POST", body: formData });
```

On success, redirect to **`success.html`**. Netlify picks these up at deploy time because of `data-netlify`.

### 9.2 Trainer / Zoho modal (“axi-form”)

On many pages, a modal collects name, email, phone, etc., and posts via **`fetch('https://axiostatmilitary.com/lead.php', ...)`** — a **production PHP endpoint**, not in this repo.

On **`axiostat-z-fold-trainer-pack.html`**, the same idea uses the **Netlify function** instead:

```text
POST /.netlify/functions/lead
```

Implementation: **`netlify/functions/lead.js`** — validates input, optional honeypot `hp_field`, simple rate limit, forwards to **Zoho CRM Web-to-Lead** using **environment variables** (`ZOHO_*`, `ALLOWED_ORIGIN`, etc.).

When implementing or debugging leads locally, use **`netlify dev`** and set env vars in **`.env`** (see `.gitignore`; do not commit secrets).

### 9.3 reCAPTCHA

Some forms (e.g. trainer pack variants) integrate **reCAPTCHA** in inline scripts before submit — copy that pattern if you add protected forms.

---

## 10. Dynamic content from Sanity (browser-side)

Besides blogs (build-time), pages such as **`events.html`**, **`news.html`**, **`our-story.html`**, **`gallery.html`** fetch Sanity in the **browser** using a `projectId`, `dataset`, and GROQ-style query in the URL.

If events/news stop updating:

- Check Sanity dataset and document types (`event`, etc.).
- Check browser console for CORS or API errors.
- Confirm `projectId` / `dataset` in that page’s script match your CMS.

Blog **listing** on generated `blogs.html` may still reference fetch logic in templates — prefer relying on **static output** from `build.mjs` for production consistency.

---

## 11. Routing and redirects (`_redirects`)

Examples from **`_redirects`**:

- **`/blog/*` → `/blog/index.html` with `200`** — serves one HTML shell for client-side blog URLs (legacy/fallback); note **static posts** also exist under **`blog/<slug>/index.html`** after build.
- **`/blog` → `/blogs` (301)**
- Shortcuts like **`/products2`** → product URLs.

Edit **`_redirects`** when renaming URLs or adding marketing short links.

---

## 12. SEO and ancillary files

- **`sitemap.xml`** — update when adding/removing important URLs.
- **`robots.txt`** — crawler rules.
- **`404.html`** — Netlify custom error page.
- **`llms.txt`** — guidance for AI crawlers (policy/copy, not build logic).

---

## 13. Checklist: implement a **new** feature

| Step | Action                                                                                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Choose the closest existing HTML page as a template; note whether it uses `/assets/` or `assets/`.                                                                                                         |
| 2    | Copy header/footer/nav from that template; update active nav state if applicable.                                                                                                                          |
| 3    | Add content and styles (`main.css` / `responsive.css` / `myStyles.css`); sync minified CSS if needed.                                                                                                      |
| 4    | If you need carousels or sticky header behavior, extend **`main.js`** (and minified copy).                                                                                                                 |
| 5    | For forms: decide Netlify Forms vs **`/.netlify/functions/lead`** vs external `lead.php`; keep validation and UX consistent with sibling pages.                                                            |
| 6    | If the feature is blog-related: update **`blogs.template.html`** or **`blog/index.html`**, extend **`build.mjs`** if Sanity schema/new fields need rendering. Run **`node build.mjs`** and commit outputs. |
| 7    | Add redirects in **`_redirects`** if URLs need aliases; update **`sitemap.xml`** for major pages.                                                                                                          |
| 8    | Test with **`npx serve .`** or **`netlify dev`**; verify regional copies if the feature should appear in **`uk/`**, **`uae/`**, etc.                                                                       |

---

## 14. Checklist: **update** an existing feature

| Area                      | Where to look                                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Global navigation / logo  | Same blocks repeated across **`index.html`**, **`contact.html`**, product pages, **`blogs.template.html`**, **`blog/index.html`**, regional folders — search for `navbar` or a distinctive menu label. |
| Site-wide styles          | `assets/css/main.css`, `responsive.css`, minified twins                                                                                                                                                |
| Carousels / scroll header | `assets/js/main.js`                                                                                                                                                                                    |
| Blog list appearance      | `blogs.template.html` → regenerate `blogs.html`                                                                                                                                                        |
| Blog post layout / SEO    | `blog/index.html` + `build.mjs`                                                                                                                                                                        |
| Lead / Zoho behavior      | `netlify/functions/lead.js` + Netlify env vars                                                                                                                                                         |
| Analytics                 | GTM / gtag snippets in `<head>` of major templates                                                                                                                                                     |

Use global search (e.g. search for `enquiryForm`, `axi-form`, `carousel_latest`) to find every HTML file that embeds the pattern you are changing.

---

## 15. Known inconsistencies (good to be aware of)

- **Trainer modal**: some pages post to **`https://axiostatmilitary.com/lead.php`**; at least one page uses **`/.netlify/functions/lead`**. Align on one approach when you maintain forms.
- **Asset paths**: mix of relative and root-absolute URLs across folders.
- **Minified assets**: sources (`main.js`, `main.css`) vs deployed (`main-minify.js`, `main-minify.css`) can drift if only one side is edited.

---

## 16. Quick reference — files that matter most

| Goal                 | Primary files                                                                          |
| -------------------- | -------------------------------------------------------------------------------------- |
| New static page      | Duplicate relevant `.html`; `assets/css/*`; optional `assets/js/main.js`               |
| Blog pipeline        | `build.mjs`, `blogs.template.html`, `blog/index.html`, Sanity studio/schema (external) |
| Server-side lead API | `netlify/functions/lead.js`, Netlify environment variables                             |
| URL behavior         | `_redirects`, `netlify.toml`                                                           |
| Deploy behavior      | `netlify.toml`                                                                         |

This should be enough to navigate the repo confidently: treat it as a **static multi-page site** with a **small Node build for blogs** and **optional Netlify Functions** for CRM integration...
