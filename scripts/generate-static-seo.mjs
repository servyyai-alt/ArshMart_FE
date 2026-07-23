import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const rawSiteUrl = String(process.env.VITE_SITE_URL || process.env.VITE_APP_URL || 'https://sandhaikart.com').trim()
const siteUrl = rawSiteUrl.replace(/\/+$/, '') || 'https://sandhaikart.com'
const today = new Date().toISOString().slice(0, 10)

const sitemapEntries = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/products', changefreq: 'daily', priority: '0.9' },
  { loc: '/products?category=Electronics', changefreq: 'weekly', priority: '0.8' },
  { loc: '/products?category=Fashion', changefreq: 'weekly', priority: '0.8' },
  { loc: '/products?category=Home+%26+Kitchen', changefreq: 'weekly', priority: '0.8' },
  { loc: '/products?category=Sports', changefreq: 'weekly', priority: '0.8' },
  { loc: '/register', changefreq: 'monthly', priority: '0.5' },
  { loc: '/login', changefreq: 'monthly', priority: '0.4' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${siteUrl}${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/*
Disallow: /checkout
Disallow: /profile
Disallow: /orders

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(resolve('public/sitemap.xml'), sitemap, 'utf8')
writeFileSync(resolve('public/robots.txt'), robots, 'utf8')

console.log(`Generated SEO assets for ${siteUrl}`)
