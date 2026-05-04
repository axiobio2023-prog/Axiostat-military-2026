import fetch from 'node-fetch'
import fs from 'fs'

const projectId = 'qt1vz71d'
const dataset = 'production'
const cdn = `https://cdn.sanity.io/images/${projectId}/${dataset}/`
const query = encodeURIComponent(`*[_type=='post']|order(publishedAt desc)`)
const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`

const res = await fetch(url)
const { result } = await res.json()

// ─── helper: portable text → HTML ────────────────────────────────────────────
function blocksToHtml(content) {
  let html = ''
  for (const block of content) {
    if (block._type === 'block') {
      let cls = ''
      if (block.style === 'blockquote') cls = 'blockquote'
      else if (block.listItem) cls = 'bullet'
      else if (block.style) cls = block.style

      html += `<p class="${cls}">`
      for (const child of block.children) {
        if (child.marks?.length) {
          const mark = child.marks[0]
          const def = block.markDefs?.find((d) => d._key === mark)
          if (def?.href) {
            // it's a link
            html += `<a href="${def.href}" target="_blank">${child.text}</a>`
          }  else if (mark === 'em') {
            html += `<em>${child.text}</em>`
          } else if (mark === 'underline') {
            html += `<u>${child.text}</u>`
          } else {
            // unknown mark — just render plain text
            html += child.text
          }
        } else {
          html += child.text
        }
      }
      html += `</p>`
    } else if (block._type === 'image') {
      const parts = block.asset._ref.split('-')
      const src = `${cdn}${parts[1]}-${parts[2]}.${parts[3]}`
      html += `<img class="w-100 mb-3" src="${src}" alt="${block.alt || ''}" />`
    }
  }
  return html
}

// ─── helper: image url from ref ──────────────────────────────────────────────
function imageUrl(ref) {
  const parts = ref.split('-')
  return `${cdn}${parts[1]}-${parts[2]}.${parts[3]}`
}

// ─── 1. generate blogs.html ───────────────────────────────────────────────────
const blogCards = result
  .map((post) => {
    const img = post.mainImage?.asset._ref ? imageUrl(post.mainImage.asset._ref) : ''
    const date = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : ''
    const title = (post.title ?? '').slice(0, 70)
    const desc = (post.body?.[0]?.children?.[0]?.text ?? '').slice(0, 210)
    const slug = post.slug?.current ?? '#'

    return `
  <div class="col-md-4">
    <div class="blog_wrap mb-3">
      ${img ? `<img src="${img}" class="w-100 mb-3" alt="${title}" loading="lazy" />` : ''}
      <button class="date btn_secondary">${date}</button>
      <h5 class="title" style="text-transform:capitalize">${title}...</h5>
      <p class="desc">${desc}...</p>
      <a href="/blog/${slug}">
        <button class="btn_secondary">Know More</button>
      </a>
    </div>
  </div>`
  })
  .join('\n')

let listTemplate = fs.readFileSync('blogs.template.html', 'utf8')
listTemplate = listTemplate.replace(`<div class="row" id="blogSet">`, `<div class="row" id="blogSet">\n${blogCards}`)
fs.writeFileSync('blogs.html', listTemplate)
console.log(`✅ blogs.html generated`)

// ─── 2. generate individual blog pages ───────────────────────────────────────
let detailTemplate = fs.readFileSync('blog/index.html', 'utf8')

// fix all asset paths from ../assets/ to /assets/
detailTemplate = detailTemplate.replace(/\.\.\/assets\//g, '/assets/')
detailTemplate = detailTemplate.replace(/href="\.\.\/index\.html"/g, 'href="/index.html"')
detailTemplate = detailTemplate.replace(/href="\.\.\/([^"]+)"/g, 'href="/$1"')
detailTemplate = detailTemplate.replace(/src="\.\.\/([^"]+)"/g, 'src="/$1"')

// remove the JS fetch script entirely — content is now hardcoded
detailTemplate = detailTemplate.replace(/\/\/ If URL is exactly \/blog[\s\S]*?<\/script>/m, '')
detailTemplate = detailTemplate.replace(/const projectId = "qt1vz71d"[\s\S]*?createBlogContent\(\);[\s\S]*?<\/script>/m, '')

fs.mkdirSync('blog', { recursive: true })

for (const post of result) {
  const slug = post.slug?.current
  if (!slug) continue

  const title = post.title ?? ''
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''
  const metaDesc = (post.body ?? [])
    .filter((b) => b._type === 'block')
    .map((b) => b.children.map((c) => c.text).join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150)
  const bodyHtml = blocksToHtml(post.body ?? [])
  const bannerImg = post.mainImage?.asset._ref ? imageUrl(post.mainImage.asset._ref) : ''

  let output = detailTemplate

  // ── meta & title ──
  output = output.replace(
    `<meta charset="utf-8">`,
    `<meta charset="utf-8">
    <title>${title} | Axiostat Military</title>
    <meta name="description" content="${metaDesc}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metaDesc}">
    ${bannerImg ? `<meta property="og:image" content="${bannerImg}">` : ''}
    <link rel="canonical" href="https://axiostatmilitary.com/blog/${slug}">`,
  )

  // ── blog header (title + date + banner image) ──
  output = output.replace(
    `<div class="row justify-content-center" id="blogHead">`,
    `<div class="row justify-content-center" id="blogHead">
      <div class="col-md-5 d-flex justify-content-evenly align-items-start flex-column">
        <small>Posted on <b>${date}</b></small>
        <h1 class="title display-6 text-uppercase b_700 fst-italic color1">${title}</h1>
      </div>
      ${
        bannerImg
          ? `
      <div class="col-md-5 d-flex align-items-center">
        <img class="w-100 rounded-2" src="${bannerImg}" alt="${title}" />
      </div>`
          : ''
      }`,
  )

  // ── blog body ──
  output = output.replace(`<div class="col-md-8" id="blogContent">`, `<div class="col-md-8" id="blogContent">${bodyHtml}`)

  fs.mkdirSync(`blog/${slug}`, { recursive: true })
  fs.writeFileSync(`blog/${slug}/index.html`, output)
  console.log(`✅ /blog/${slug}`)
}

console.log(`\n✅ ${result.length} blog pages generated`)
