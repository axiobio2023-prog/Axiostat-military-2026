import fetch from 'node-fetch'
import fs from 'fs'

const projectId = 'qt1vz71d'
const dataset = 'production'
const cdn = `https://cdn.sanity.io/images/${projectId}/${dataset}/`
const query = encodeURIComponent(`*[_type=='post']|order(publishedAt desc)`)
const url = `https://${projectId}.api.sanity.io/v1/data/query/${dataset}?query=${query}`

const res = await fetch(url)
const { result } = await res.json()

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

const template = fs.readFileSync('blogs.template.html', 'utf8')
const output = template.replace(`<div class="row" id="blogSet">`, `<div class="row" id="blogSet">\n${blogCards}`)

fs.writeFileSync('blogs.html', output)
console.log(`✅ ${result.length} blogs injected into blogs.html`)
