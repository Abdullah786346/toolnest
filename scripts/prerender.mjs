import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

const siteUrl = 'https://www.onlinetoolnest.tech'
const root = process.cwd()
const distDirectory = path.join(root, 'dist')
const sitemap = await readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8')
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => {
  const parsedUrl = new URL(url)
  if (parsedUrl.origin !== siteUrl || parsedUrl.search || parsedUrl.hash) {
    throw new Error(`Unsupported sitemap URL: ${url}`)
  }
  return parsedUrl.pathname === '/' ? '/' : parsedUrl.pathname.replace(/\/$/, '')
})

if (routes.length === 0 || new Set(routes).size !== routes.length) {
  throw new Error('Sitemap must contain unique page URLs')
}

const server = await createServer({
  configFile: path.join(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const [{ default: App }, { getPageMetadata }, template] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    server.ssrLoadModule('/src/seoMetadata.ts'),
    readFile(path.join(distDirectory, 'index.html'), 'utf8'),
  ])

  for (const route of routes) {
    const { title, description, keywords, currentTool } = getPageMetadata(route)
    const appHtml = renderToString(
      createElement(MemoryRouter, { initialEntries: [route] }, createElement(App)),
    )
    const canonicalUrl = `${siteUrl}${route}`
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'ToolNest',
          url: `${siteUrl}/`,
        },
        {
          '@type': currentTool ? 'WebApplication' : 'WebPage',
          name: title,
          url: canonicalUrl,
          description,
          isPartOf: { '@type': 'WebSite', name: 'ToolNest', url: `${siteUrl}/` },
          ...(currentTool ? {
            applicationCategory: currentTool.category,
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          } : {}),
        },
      ],
    }

    const html = template
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(description)}$2`)
      .replace(/(<meta name="keywords" content=")[^"]*(")/, `$1${escapeHtml(keywords)}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonicalUrl}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeHtml(title)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escapeHtml(description)}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonicalUrl}$2`)
      .replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
      )

    const outputDirectory = path.join(distDirectory, ...route.split('/').filter(Boolean))
    await mkdir(outputDirectory, { recursive: true })
    await writeFile(path.join(outputDirectory, 'index.html'), html)
  }

  console.log(`Prerendered ${routes.length} sitemap pages.`)
} finally {
  await server.close()
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
