import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Copy, FileSearch, Menu, Moon, RefreshCw, Search, ShieldCheck, Sparkles, Sun, X, Zap } from 'lucide-react'
import { categories, pakistanGuides, providers, tools, type Tool } from './data'
import './App.css'

type ToolState = { input: string; output: string; error: string }
const SITE_URL = 'https://onlinetoolnest.tech'
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const toolBySlug = (slug: string) => tools.find((item) => item.slug === slug)

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('toolnest-theme') === 'dark')
  const [menu, setMenu] = useState(false); const route = useLocation().pathname
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('toolnest-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => {
    const current = toolBySlug(route.split('/')[2])
    const category = categories.find((item) => `/category/${item.slug}` === route)
    const title = current?.seoTitle || category ? current?.seoTitle || `${category?.name} | Free Online Tools | ToolNest` : route === '/popular' ? 'Popular Free Online Tools | ToolNest' : route === '/pakistan' ? 'Pakistan Utility Guides | ToolNest' : route === '/about' ? 'About ToolNest' : 'ToolNest | Free Online Tools, PDF Tools & Pakistan Utility Guides'
    const description = current?.seoDescription || category ? current?.seoDescription || `Browse free ${category?.name.toLowerCase()} for fast, practical work online. No registration required with ToolNest.` : route === '/popular' ? 'Use ToolNest popular free online tools for PDF, text, image, calculator, and developer tasks.' : 'Free online tools for PDF, image, text, calculator, and developer tasks. Explore Pakistan utility guides for Telenor, Jazz, Zong, and Ufone.'
    const keywords = current ? `${current.name}, ${current.category}, free online ${current.name.toLowerCase()}, ToolNest, ${current.name.toLowerCase()} tool` : 'free online tools, PDF tools, image compressor, word counter, text tools, calculator tools, developer tools, JSON formatter, Pakistan utility guides, Telenor balance check, Jazz package check, Zong internet settings, Ufone codes, ToolNest'
    const ogTitle = current ? `${current.name} | ToolNest` : 'ToolNest | Free Online Tools, PDF Tools & Pakistan Utility Guides'
    const ogDescription = current ? current.seoDescription : 'Free online tools for PDF, image, text, calculator, and developer work, plus Pakistan utility guides for telecom checks.'

    document.title = title

    const metaDescription = document.querySelector('meta[name="description"]'); if (metaDescription) metaDescription.setAttribute('content', description)
    const metaKeywords = document.querySelector('meta[name="keywords"]'); if (metaKeywords) metaKeywords.setAttribute('content', keywords)
    const metaOgTitle = document.querySelector('meta[property="og:title"]'); if (metaOgTitle) metaOgTitle.setAttribute('content', ogTitle)
    const metaOgDescription = document.querySelector('meta[property="og:description"]'); if (metaOgDescription) metaOgDescription.setAttribute('content', ogDescription)
    const metaTwitterTitle = document.querySelector('meta[name="twitter:title"]'); if (metaTwitterTitle) metaTwitterTitle.setAttribute('content', ogTitle)
    const metaTwitterDescription = document.querySelector('meta[name="twitter:description"]'); if (metaTwitterDescription) metaTwitterDescription.setAttribute('content', ogDescription)
    const canonical = document.querySelector('link[rel="canonical"]'); if (canonical) canonical.setAttribute('href', `${SITE_URL}${route || '/'}`)

    const faqEntries = current
      ? [
          { question: `Is ${current.name} free to use?`, answer: `Yes. ${current.name} is free to use online on ToolNest with no registration required.` },
          { question: 'Does ToolNest store my data?', answer: 'ToolNest runs most tools in the browser and keeps the experience lightweight. Avoid entering sensitive information into any online tool.' },
          { question: 'Can I use ToolNest on mobile?', answer: 'Yes. ToolNest is designed to work well on modern desktop and mobile browsers.' }
        ]
      : [
          { question: 'Are the tools on ToolNest free?', answer: 'Yes. ToolNest offers free online tools for everyday work, editing, productivity, and utility checks.' },
          { question: 'Does ToolNest include Pakistan utility guides?', answer: 'Yes. ToolNest includes Pakistan telecom guides for Telenor, Jazz, Zong, and Ufone utilities and support information.' },
          { question: 'Can I use ToolNest without creating an account?', answer: 'Yes. Most tools are available without registration, making them quick to use.' }
        ]

    const itemList = tools.slice(0, 8).map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebApplication',
        name: tool.name,
        applicationCategory: tool.category,
        url: `${SITE_URL}/tools/${tool.slug}`
      }
    }))

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: 'ToolNest', url: `${SITE_URL}/` },
        {
          '@type': current ? 'WebPage' : 'CollectionPage',
          name: title,
          url: `${SITE_URL}${route || '/'}`,
          description: description,
          isPartOf: { '@type': 'WebSite', name: 'ToolNest', url: `${SITE_URL}/` },
          ...(current ? {
            mainEntity: {
              '@type': 'WebApplication',
              name: current.name,
              description: current.seoDescription,
              applicationCategory: current.category,
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              url: `${SITE_URL}/tools/${current.slug}`
            }
          } : {}),
          ...(current ? {} : { hasPart: itemList })
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.answer
            }
          }))
        }
      ]
    }

    let script = document.querySelector('#toolnest-schema') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = 'toolnest-schema'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(schema)
  }, [route])
  let page = <Home />
  if (route.startsWith('/tools/')) page = <ToolPage slug={route.split('/')[2]} />
  else if (route === '/popular') page = <PopularPage />
  else if (route.startsWith('/category/')) page = <CategoryPage slug={route.split('/')[2]} />
  else if (route.startsWith('/pakistan')) page = <PakistanPage path={route} />
  else if (['/about', '/contact', '/privacy', '/terms', '/disclaimer', '/sitemap'].includes(route)) page = <InfoPage path={route} />
  return <div className="app-shell"><header className="site-header"><div className="header-inner"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={16} /></span> tool<span>nest</span></Link><nav className={`main-nav ${menu ? 'open' : ''}`}><Link to="/">Tools</Link><Link to="/category/pdf-tools">Categories</Link><Link to="/pakistan">Pakistan</Link><Link to="/popular">Popular</Link><Link to="/about">About</Link></nav><div className="header-actions"><Link to="/" className="header-search"><Search size={18} /><span>Search tools</span><kbd>⌘ K</kbd></Link><button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X size={20} /> : <Menu size={20} />}</button></div></div></header><main>{page}</main><Footer /></div>
}

function PopularPage() { return <div className="page-wrap"><Breadcrumbs items={['Popular tools']} /><div className="page-intro"><div className="eyebrow">POPULAR TOOLS</div><h1>Start with the essentials</h1><p>Quick, focused tools for common tasks.</p></div><div className="tool-grid">{tools.filter((tool) => tool.popular).map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></div> }

function Home() { const [query, setQuery] = useState(''); const results = useMemo(() => query ? tools.filter((tool) => `${tool.name} ${tool.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [], [query]); return <><section className="hero"><div className="hero-grid" /><div className="eyebrow"><span className="live-dot" /> Free tools. Clear results. No account needed.</div><h1>Free Online Tools for PDF, Image, Text, Calculator & Developer Work</h1><p className="hero-copy">ToolNest helps you find free online tools for PDF tools, image compressor, word counter, JSON formatter, and daily productivity tasks. Discover practical Pakistan utility guides for Telenor balance check, Jazz package check, Zong internet settings, and Ufone codes in one place.</p><div className="hero-search-wrap"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a tool..." aria-label="Search for a tool" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}<span className="search-shortcut">⌘ K</span>{results.length > 0 && <div className="search-results">{results.map((tool) => <Link to={`/tools/${tool.slug}`} key={tool.slug}><tool.icon size={17} /><span><strong>{tool.name}</strong><small>{tool.category}</small></span><ArrowRight size={15} /></Link>)}</div>}</div><div className="hero-trust"><span><Check size={15} /> Free to use</span><span><Check size={15} /> No registration</span><span><Check size={15} /> Your files stay private</span></div></section><section className="section"><SectionHeading eyebrow="START HERE" title="Popular free online tools" /><div className="tool-grid">{tools.filter((tool) => tool.popular).map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></section><section className="section category-section"><SectionHeading eyebrow="EXPLORE BY NEED" title="Browse tool categories" /><div className="category-grid">{categories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div></section><section className="section utility-band"><div><div className="eyebrow">MADE FOR PAKISTAN</div><h2>Everyday answers,<br /><em>without the guesswork.</em></h2><p>Quick, practical guides for checking balances, packages, numbers, and more across Pakistan's major networks.</p><Link to="/pakistan" className="button button-dark">Explore Pakistan guides <ArrowRight size={16} /></Link></div><div className="provider-stack">{providers.map((provider, index) => <Link to={`/pakistan/${provider.toLowerCase()}`} className="provider-row" key={provider}><span className={`provider-logo p-${index}`}>{provider[0]}</span><span><strong>{provider}</strong><small>8 quick guides</small></span><ArrowRight size={17} /></Link>)}</div></section><section className="section"><SectionHeading eyebrow="GOOD TO KNOW" title="Questions, answered." /><FAQ items={[['Are ToolNest tools really free?', 'Yes. Every tool on ToolNest is free to use without creating an account.'], ['Do you upload my files?', 'No. Our browser-based tools process supported files locally where possible.'], ['Are the Pakistan guides current?', 'Each guide includes an update note because telecom codes can change.']]} /></section></> }
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div></div> }
function ToolCard({ tool }: { tool: Tool }) { const Icon = tool.icon; return <Link to={`/tools/${tool.slug}`} className="tool-card"><div className="card-icon"><Icon size={20} /></div><div><h3>{tool.name}</h3><p>{tool.description}</p><span className="card-link">Open tool <ArrowRight size={14} /></span></div></Link> }
function CategoryCard({ category }: { category: typeof categories[number] }) { const Icon = category.icon; const href = category.slug === 'pakistan' ? '/pakistan' : `/category/${category.slug}`; return <Link to={href} className={`category-card tone-${category.tone}`}><span className="category-icon"><Icon size={21} /></span><span><strong>{category.name}</strong><small>{category.count} tools</small></span><ArrowRight size={17} /></Link> }
function FAQ({ items }: { items: [string, string][] }) { return <div className="faq-list">{items.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div> }
function CategoryPage({ slug }: { slug: string }) { const category = categories.find((item) => item.slug === slug); const list = tools.filter((tool) => slugify(tool.category) === slug); return <div className="page-wrap"><Breadcrumbs items={['Categories', category?.name || 'Tools']} /><div className="page-intro"><div className="eyebrow">TOOL COLLECTION</div><h1>{category?.name || 'Online tools'}</h1><p>Simple, focused tools for getting useful work done quickly.</p></div><div className="tool-grid">{list.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></div> }
function ToolPage({ slug }: { slug: string }) { const tool = toolBySlug(slug); if (!tool) return <NotFound />; return <ToolContent tool={tool} /> }
function ToolContent({ tool }: { tool: Tool }) { const [state, setState] = useState<ToolState>({ input: '', output: '', error: '' }); const [copied, setCopied] = useState(false); const [fileName, setFileName] = useState(''); const Icon = tool.icon; const run = () => { const value = state.input; let output = value; let error = ''; try { switch (tool.slug) { case 'word-counter': output = `${value.trim() ? value.trim().split(/\s+/).length : 0} words\n${value.length} characters`; break; case 'character-counter': output = `${value.length} characters\n${value.replace(/\s/g, '').length} characters without spaces`; break; case 'case-converter': output = value.toLowerCase(); break; case 'remove-duplicate-lines': output = [...new Set(value.split(/\r?\n/))].join('\n'); break; case 'text-sorter': output = value.split(/\r?\n/).filter(Boolean).sort((a, b) => a.localeCompare(b)).join('\n'); break; case 'json-formatter': output = JSON.stringify(JSON.parse(value), null, 2); break; case 'json-validator': JSON.parse(value); output = 'Valid JSON'; break; case 'url-encoder-decoder': output = encodeURIComponent(value); break; case 'uuid-generator': output = crypto.randomUUID(); break; case 'password-generator': output = Array.from(crypto.getRandomValues(new Uint32Array(20)), (n) => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'[n % 66]).join(''); break; case 'percentage-calculator': { const [a, b] = value.split(',').map(Number); output = Number.isFinite(a) && Number.isFinite(b) ? `${(a / 100) * b}` : ''; break } case 'discount-calculator': { const [price, discount] = value.split(',').map(Number); output = Number.isFinite(price) && Number.isFinite(discount) ? `Sale price: ${(price * (1 - discount / 100)).toFixed(2)}\nYou save: ${(price * discount / 100).toFixed(2)}` : ''; break } default: output = value ? `Ready to process: ${fileName || 'your input'}` : '' } } catch { error = 'That input could not be processed. Check the format and try again.' } setState({ ...state, output, error }) }; const reset = () => { setState({ input: '', output: '', error: '' }); setFileName('') }; const copy = async () => { await navigator.clipboard.writeText(state.output); setCopied(true); setTimeout(() => setCopied(false), 1400) }; const isFile = ['pdf', 'image', 'jpg', 'png', 'webp'].some((key) => tool.slug.includes(key)); return <div className="page-wrap tool-page"><Breadcrumbs items={[tool.category, tool.name]} /><div className="tool-layout"><article><div className="tool-title"><div className="tool-title-icon"><Icon size={24} /></div><div><div className="eyebrow">{tool.category.toUpperCase()}</div><h1>{tool.name}</h1><p>{tool.description}</p></div></div><div className="workspace"><div className="workspace-top"><strong>Try it now</strong><span>Runs in your browser <ShieldCheck size={14} /></span></div>{isFile ? <label className="drop-zone"><FileSearch size={30} /><strong>{fileName || 'Drop a file here or choose one'}</strong><small>Files are processed locally where supported</small><input type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name || '')} /></label> : <textarea value={state.input} onChange={(event) => setState({ ...state, input: event.target.value, error: '' })} placeholder={placeholderFor(tool.slug)} aria-label={`${tool.name} input`} />}{state.error && <div className="error-message">{state.error}</div>}<div className="workspace-actions"><button className="button button-primary" onClick={run}><Zap size={15} /> Run tool</button><button className="button button-ghost" onClick={reset}><RefreshCw size={15} /> Reset</button>{state.output && <button className="button button-ghost" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy result'}</button>}</div>{state.output && <pre className="output-box">{state.output}</pre>}</div><ArticleContent tool={tool} /></article><aside><AdSlot label="Advertisement" /><div className="side-note"><ShieldCheck size={18} /><strong>Private by design</strong><p>We keep this tool simple and your work yours.</p></div></aside></div></div> }
function placeholderFor(slug: string) { const placeholders: Record<string, string> = { 'word-counter': 'Paste or type your text here...', 'json-formatter': '{\n  "hello": "world"\n}', 'percentage-calculator': 'Enter percentage, number (e.g. 15, 240)', 'discount-calculator': 'Enter price, discount (e.g. 1000, 20)' }; return placeholders[slug] || 'Enter your text here...' }
function ArticleContent({ tool }: { tool: Tool }) { return <div className="article-content"><h2>How to use {tool.name.toLowerCase()}</h2><p>Use this free online tool in a few simple steps. Add your input above, run the tool, then copy or download the result when it is ready. ToolNest keeps the experience focused so you can finish the task without installing software.</p><h2>Frequently asked questions</h2><FAQ items={[[`Is ${tool.name} free?`, `Yes. ${tool.name} is free to use online without registration.`], ['Does ToolNest store my input?', 'Browser-based text processing happens locally. Avoid entering sensitive information into any online service.'], ['Can I use this on my phone?', 'Yes. The interface is responsive and works in modern mobile browsers.']]} /><h2>Related tools</h2><div className="related-tools">{tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 3).map((item) => <Link to={`/tools/${item.slug}`} key={item.slug}>{item.name}<ArrowRight size={14} /></Link>)}</div></div> }
function PakistanPage({ path }: { path: string }) { const provider = path.split('/')[2]; const name = provider ? provider[0].toUpperCase() + provider.slice(1) : ''; return <div className="page-wrap"><Breadcrumbs items={name ? ['Pakistan', name] : ['Pakistan utilities']} /><div className="page-intro"><div className="eyebrow">PAKISTAN UTILITY GUIDES</div><h1>{name || 'Useful guides for Pakistan'}</h1><p>Practical, update-friendly guides for checking telecom services. Codes and offers can change, so confirm important details with your provider.</p></div><div className="provider-grid">{(name ? pakistanGuides : providers).map((item) => <Link to={name ? `/pakistan/${provider}/${slugify(item)}` : `/pakistan/${item.toLowerCase()}`} className="guide-card" key={item}><span className="guide-number">{name ? 'Q' : item[0]}</span><span><strong>{name ? `${name} ${item}` : `${item} guides`}</strong><small>{name ? 'Answer, context, and last updated date' : 'View utility guides'}</small></span><ArrowRight size={17} /></Link>)}</div><div className="update-note"><ShieldCheck size={19} /><div><strong>Information that can change</strong><p>Telecom codes, packages, and support numbers may be updated by providers. Each guide is written to be easy to review and update.</p></div></div></div> }
function InfoPage({ path }: { path: string }) { const pages: Record<string, [string, string]> = { '/about': ['About ToolNest', 'ToolNest is a small, independent collection of practical browser tools and clearly sourced utility guides.'], '/contact': ['Contact us', 'Have a correction, suggestion, or accessibility issue? Email hello@onlinetoolnest.tech and include the page URL.'], '/privacy': ['Privacy policy', 'ToolNest is designed to minimize data collection. We do not require accounts for tools.'], '/terms': ['Terms of service', 'Use ToolNest responsibly. Results are provided for convenience and should be checked before important decisions.'], '/disclaimer': ['Disclaimer', 'Guides are educational and can become outdated when providers change their services. Confirm important information with official support.'], '/sitemap': ['Sitemap', 'Browse the main ToolNest sections and popular tools.'] }; const [title, copy] = pages[path] || pages['/about']; return <div className="page-wrap legal-page"><Breadcrumbs items={[title]} /><div className="page-intro"><div className="eyebrow">TOOLNEST</div><h1>{title}</h1><p>{copy}</p></div>{path === '/sitemap' ? <div className="sitemap-grid"><Link to="/">Home</Link><Link to="/pakistan">Pakistan guides</Link>{categories.map((category) => <Link to={`/category/${category.slug}`} key={category.slug}>{category.name}</Link>)}{tools.map((tool) => <Link to={`/tools/${tool.slug}`} key={tool.slug}>{tool.name}</Link>)}</div> : <ArticleContent tool={tools[0]} />}</div> }
function Breadcrumbs({ items }: { items: string[] }) { return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{items.map((item) => <span key={item}>/ {item}</span>)}</nav> }
function AdSlot({ label }: { label: string }) { return <div className="ad-slot"><span>{label}</span></div> }
function NotFound() { return <div className="page-wrap empty-state"><FileSearch size={38} /><h1>That page is missing</h1><p>Try one of our useful tools instead.</p><Link to="/" className="button button-primary">Back to home</Link></div> }
function Footer() { return <footer><div className="footer-inner"><div><Link to="/" className="brand">tool<span>nest</span></Link><p>Small tools for real life.<br />Useful, private, and free.</p></div><div className="footer-links"><div><strong>Explore</strong><Link to="/">All tools</Link><Link to="/pakistan">Pakistan guides</Link><Link to="/about">About us</Link></div><div><strong>Company</strong><Link to="/contact">Contact</Link><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms</Link></div><div><strong>More</strong><Link to="/disclaimer">Disclaimer</Link><Link to="/sitemap">Sitemap</Link></div></div></div><div className="footer-bottom"><span>© 2025 ToolNest. Built for useful work.</span><span>Made with care, for the web.</span></div></footer> }
export default App
