import fetch from 'node-fetch'
import fs from 'fs'

const projectId = 'qt1vz71d'
const dataset = 'production'
const cdn = `https://cdn.sanity.io/images/${projectId}/${dataset}/`
const query = encodeURIComponent(`*[_type=='post']|order(publishedAt desc)`)
const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`

const res = await fetch(url)
const { result } = await res.json()

// ─── helper: portable text → HTML ───────────────────────────────────────────
function blocksToHtml(content, cdn) {
  let html = ''
  content.forEach((block) => {
    if (block._type === 'block') {
      let cls = ''
      if (block.style === 'blockquote') cls = 'blockquote'
      else if (block.listItem) cls = 'bullet'
      else if (block.style) cls = block.style

      html += `<p class="${cls}">`
      block.children.forEach((child) => {
        if (child.marks?.length) {
          const mark = child.marks[0]
          const def = block.markDefs?.find((d) => d._key === mark)
          if (def?.href) {
            html += `<a href="${def.href}" target="_blank">${child.text}</a>`
          } else {
            html += `<span>${child.text}</span>`
          }
        } else {
          html += `<span>${child.text}</span>`
        }
      })
      html += `</p>`
    } else if (block._type === 'image') {
      const parts = block.asset._ref.split('-')
      const src = `${cdn}${parts[1]}-${parts[2]}.${parts[3]}`
      html += `<img class="w-100 mb-3" src="${src}" alt="${block.alt || ''}" />`
    }
  })
  return html
}

// ─── generate blogs.html ─────────────────────────────────────────────────────
const blogCards = result
  .map((post) => {
    const ref = post.mainImage?.asset._ref.split('-') ?? []
    const img = ref.length ? `${cdn}${ref[1]}-${ref[2]}.${ref[3]}` : ''
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

const listTemplate = fs.readFileSync('blogs.template.html', 'utf8')
const listOutput = listTemplate.replace(`<div class="row" id="blogSet">`, `<div class="row" id="blogSet">\n${blogCards}`)
fs.writeFileSync('blogs.html', listOutput)
console.log(`✅ blogs.html generated`)

// ─── generate individual blog pages ──────────────────────────────────────────
const detailTemplate = fs.readFileSync('blog/index.html', 'utf8')

fs.mkdirSync('blog', { recursive: true })

for (const post of result) {
  const slug = post.slug?.current
  if (!slug) continue

  const title = post.title ?? ''
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  // banner image
  let bannerHtml = ''
  if (post.mainImage?.asset._ref) {
    const parts = post.mainImage.asset._ref.split('-')
    const imgUrl = `${cdn}${parts[1]}-${parts[2]}.${parts[3]}`
    bannerHtml = `
      <div class="col-md-5 d-flex align-items-center">
        <img class="w-100 rounded-2" src="${imgUrl}" alt="${title}" />
      </div>`
  }

  // meta description
  const metaDesc = (post.body ?? [])
    .filter((b) => b._type === 'block')
    .map((b) => b.children.map((c) => c.text).join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150)

  // body content
  const bodyHtml = blocksToHtml(post.body ?? [], cdn)

  // inject into template
  let output = detailTemplate

  // set title & meta
  output = output.replace(
    `<meta charset="utf-8">`,
    `<meta charset="utf-8">
    <title>${title}</title>
    <meta name="description" content="${metaDesc}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metaDesc}">
    <link rel="canonical" href="https://axiostatmilitary.com/blog/${slug}">`,
  )

  // inject head section
  output = output.replace(
    `<div class="row justify-content-center" id="blogHead">`,
    `<div class="row justify-content-center" id="blogHead">
      <div class="col-md-5 d-flex justify-content-evenly align-items-start flex-column">
        <small>Posted on <b>${date}</b></small>
        <h1 class="title display-6 text-uppercase b_700 fst-italic color1">${title}</h1>
      </div>
      ${bannerHtml}`,
  )

  // inject body content
  output = output.replace(`<div class="col-md-8" id="blogContent">`, `<div class="col-md-8" id="blogContent">${bodyHtml}`)

  // write to /blog/[slug]/index.html so URL is /blog/slug
  fs.mkdirSync(`blog/${slug}`, { recursive: true })
  fs.writeFileSync(`blog/${slug}/index.html`, output)
  console.log(`✅ /blog/${slug}`)
}

console.log(`\n✅ ${result.length} blog pages generated`)
