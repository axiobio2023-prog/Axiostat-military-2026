# Sanity CMS usage in this project

This site uses [Sanity](https://www.sanity.io/) as a **headless CMS**. Content is read through Sanity’s **public HTTP Query API** (GROQ). There is **no** `@sanity/client` or Sanity Studio code in this repository—the Studio (where editors work) lives elsewhere, and this repo only **consumes** published documents.

---

## 1. Project and dataset

The same identifiers are repeated in multiple files:

| Setting | Value |
|--------|--------|
| **Project ID** | `qt1vz71d` |
| **Dataset** | `production` |

**API base (queries)**:

```text
https://qt1vz71d.api.sanity.io/v1/data/query/production?query=<GROQ>
```

**Image CDN base**:

```text
https://cdn.sanity.io/images/qt1vz71d/production/
```

If you migrate to another Sanity project or dataset, you must update **every** place that hard-codes these values (see [§8 Locations](#8-file-locations-summary)).

---

## 2. Two ways Sanity is used

### A. Build-time (blogs only) — `build.mjs`

On deploy, Netlify runs:

```bash
node build.mjs
```

That script:

1. **GET** the Query API with a fixed GROQ query for blog posts.
2. Builds **`blogs.html`** by injecting HTML cards into **`blogs.template.html`** (replacing the `#blogSet` row).
3. For each post with a `slug.current`, writes **`blog/<slug>/index.html`** using **`blog/index.html`** as the shell template.
4. Converts Sanity **portable text** (`body`) into HTML with **`blocksToHtml()`**.
5. Resolves **`mainImage`** via **`imageUrl()`** using the CDN pattern above.
6. Strips legacy client-side “fetch blog by slug” scripts from the detail template so generated pages are **static**.

**Build query** (URL-encoded in the script):

```groq
*[_type=='post']|order(publishedAt desc)
```

**Post fields the build expects** (by usage in code):

| Field | Purpose |
|--------|---------|
| `title` | Page `<title>`, headings, cards |
| `slug.current` | Path `/blog/<slug>/`, filenames |
| `publishedAt` | Dates on cards and detail pages |
| `mainImage.asset._ref` | Hero/card images → CDN URL |
| `body` | Portable text blocks → HTML |

Portable text handling in **`blocksToHtml()`**:

- **`block`** → `<p>` with optional classes: `blockquote`, `bullet`, or the block `style`.
- **Marks**: links (`markDefs` + `href`), `em`, `underline`; other marks fall back to plain text.
- **`image`** → `<img>` from asset ref via CDN.

If you add new block types or marks in Sanity, extend **`blocksToHtml()`** in **`build.mjs`** or those blocks will not render correctly on generated pages.

### B. Run-time (browser) — `fetch()` from HTML pages

Several pages run **JavaScript in the browser** that calls the same Query API and renders JSON into the DOM. No API token is used in these snippets—they rely on the dataset being **publicly readable** (typical for public marketing content).

They all define:

- `projectId`, `dataset`
- `cdn` for assembling image URLs from refs (same pattern as **`build.mjs`**)

---

## 3. Content types (GROQ) by page

| Sanity `_type` | Where it’s used | Query pattern (conceptually) |
|----------------|------------------|------------------------------|
| **`post`** | **`build.mjs`**, **`blogs.html`** / **`blogs.template.html`** (listing fetch JS may remain but listing is also **pre-rendered** in `blogs.html` after build) | `*[_type=='post'] \| order(publishedAt desc)` |
| **`post`** (single) | **`blog/index.html`** (template), **`blog-details.html`** | Match slug: `*[slug.current=='…']` |
| **`event`** | **`events.html`**, **`publications.html`** | `*[_type=='event'] \| order(startdate desc)` |
| **`event`** (upcoming only) | **`our-story.html`**, **`story.html`**, **`story_backup.html`** | `_type == "event"` and `dateTime(enddate) > dateTime(now())`, ordered by `startdate desc` (query is URL-encoded in the HTML) |
| **`news`** | **`news.html`** | `*[_type=='news'] \| order(date desc)` |
| **`gallery`** | **`gallery.html`** | `*[_type=='gallery'] \| order(_createdAt desc)` |

Exact query strings live in each file’s `blog_url`, `allEvents`, `allNews`, etc.

---

## 4. Image URLs from Sanity asset refs

Refs look like `image-<id>-<dimensions>-<format>`. Code splits on `-` and builds:

```text
https://cdn.sanity.io/images/{projectId}/{dataset}/{id}-{dimensions}.{format}
```

This logic appears in **`build.mjs`** and in inline scripts on pages that render Sanity images client-side.

---

## 5. Blog URLs and `_redirects`

- Static generated posts: **`/blog/<slug>/`** (file: **`blog/<slug>/index.html`**).
- **`_redirects`** includes a rule that serves **`/blog/index.html`** for **`/blog/*`** with status **200** (fallback for older client-routed URLs). Prefer linking to **`/blog/<slug>/`** for individual posts after build.

---

## 6. Relationship between templates and generated output

| File | Role |
|------|------|
| **`blogs.template.html`** | Source template for the blog **listing**; **`build.mjs`** injects cards into `#blogSet` → output **`blogs.html`**. |
| **`blog/index.html`** | Source template for a single **post** shell; **`build.mjs`** writes **`blog/<slug>/index.html`** per post and removes dynamic loaders where regex matches. |

Editing **`blog/index.html`** affects **future** generated post pages after **`node build.mjs`** is run again—committed **`blog/*/index.html`** files until regenerated reflect the last build.

---

## 7. Operational checklist

**Publishing a new blog post**

1. Add/update the document in Sanity (type **`post`**, with `slug`, `publishedAt`, `body`, optional `mainImage`).
2. Run **`node build.mjs`** locally (or deploy so Netlify runs it).
3. Commit updated **`blogs.html`** and **`blog/<slug>/index.html`** (and any removals if posts were deleted).

**Changing event/news/gallery UI**

1. Edit the relevant **`.html`** page’s fetch/render logic.
2. Ensure Sanity schema field names match what the script reads (`startdate`, `enddate`, `date`, etc.).

**Changing project or dataset**

1. Replace `qt1vz71d` and `production` everywhere (see next section).
2. Re-run **`build.mjs`** and verify API responses in the browser Network tab.

---

## 8. File locations summary

Sanity **`projectId` / `dataset`** and/or query URLs appear in:

| File | Usage |
|------|--------|
| **`build.mjs`** | Build-time posts query + portable text + image helpers |
| **`blogs.template.html`** | Client listing query (`post`) |
| **`blogs.html`** | Generated; may still contain template JS from `blogs.template.html` |
| **`blog/index.html`** | Post template + client slug queries (partially stripped in generated children) |
| **`blog-details.html`** | Client fetch by slug |
| **`events.html`** | Events query |
| **`publications.html`** | Same event query pattern as events |
| **`our-story.html`**, **`story.html`**, **`story_backup.html`** | Upcoming events query |
| **`news.html`** | News query |
| **`gallery.html`** | Gallery query |

Use your editor’s global search for `qt1vz71d` or `api.sanity.io` to find every reference.

---

## 9. What this repo does *not* include

- Sanity **Studio** (admin UI) source or deployment config  
- **Webhooks** to trigger builds on publish (if desired, configure in Sanity + Netlify)  
- **Draft mode** or authenticated preview—all queries assume **published**, public API access  

For schema changes (new fields or types), update the Studio project tied to **`qt1vz71d`**, then update **`build.mjs`** and/or the relevant HTML scripts to read those fields.
