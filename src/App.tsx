import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, FileSearch, Menu, Moon, Search, ShieldCheck, Sparkles, Sun, X, Smartphone } from 'lucide-react'
import { categories, providers, tools, type Tool } from './data'
import { PROVIDERS, GUIDE_TYPES, getGuideDetail } from './data/pakistanGuidesData'
import { ToolDispatcher } from './components/tools/ToolDispatcher'
import { PdfToPptArticle } from './components/seo/PdfToPptArticle'
import { ToolArticle } from './components/seo/ToolArticle'
import { getToolFaqs } from './data/toolFaqs'
import { ToastProvider } from './components/common/Toast'
import { CommandPalette } from './components/common/CommandPalette'
import { ToolFeedback } from './components/common/ToolFeedback'
import { PakistanGuidePage } from './components/guides/PakistanGuidePage'
import { AboutPage, ContactPage, DisclaimerPage, PrivacyPolicyPage, SitemapPage, TermsPage } from './components/legal/LegalPages'
import './App.css'

const SITE_URL = 'https://www.onlinetoolnest.tech'
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const toolBySlug = (slug: string) => tools.find((item) => item.slug === slug)

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('toolnest-theme') === 'dark')
  const [menu, setMenu] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const location = useLocation()
  const route = location.pathname
  const [searchParams] = useSearchParams()
  const searchQueryParam = searchParams.get('q') || ''

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('toolnest-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    setMenu(false)
  }, [route, searchQueryParam])

  // SEO & Dynamic Metadata Effect
  useEffect(() => {
    const parts = route.split('/').filter(Boolean)
    const currentTool = parts[0] === 'tools' ? toolBySlug(parts[1]) : null
    const category = parts[0] === 'category' ? categories.find((item) => item.slug === parts[1]) : null

    const isPakistanSpecificGuide = parts[0] === 'pakistan' && parts[1] && parts[1] !== 'telenor' || (parts[1] === 'telenor' && parts[2] !== 'quiz-today' && parts.length === 3)
    const isTelenorQuiz = route === '/pakistan/telenor/quiz-today'
    const isPdfToPpt = currentTool?.slug === 'pdf-to-ppt'
    const isSearchRoute = route === '/search' || Boolean(searchQueryParam)

    let title = 'ToolNest | Free Online Tools, PDF to PPT & Utility Guides'
    let description = 'Free online tools for PDF to PPT converter, image compressor, word counter, percentage calculator, and developer tasks, plus Pakistan utility guides.'
    let keywords = 'pdf to ppt, free online tools, pdf tools, image compressor, word counter, json formatter, percentage calculator'

    if (isSearchRoute) {
      title = `Search Results for "${searchQueryParam}" | ToolNest`
      description = `Find free online tools, converters, calculators, and Pakistan utility guides matching "${searchQueryParam}" on ToolNest.`
    } else if (isPdfToPpt) {
      title = 'PDF to PPT Converter - Free Online PDF to PowerPoint | ToolNest'
      description = 'Convert PDF to PPT online for free with ToolNest. Turn PDF documents into editable Microsoft PowerPoint (PPT/PPTX) presentations instantly in your browser.'
      keywords = 'pdf to ppt, pdf to ppt converter, convert pdf to ppt, pdf to powerpoint, pdf to pptx, free pdf to ppt converter'
    } else if (currentTool) {
      title = currentTool.seoTitle
      description = currentTool.seoDescription
    } else if (category) {
      title = `${category.name} | Free Online Tools | ToolNest`
      description = `Browse free ${category.name.toLowerCase()} for fast, practical work online. Private, browser-based tools with no registration required.`
    } else if (isTelenorQuiz) {
      title = 'My Telenor App Question Today: Quiz Answers | ToolNest'
      description = 'Looking for the My Telenor app question today? See reported quiz answers, access steps, and reward guidance.'
    } else if (isPakistanSpecificGuide) {
      const guideObj = getGuideDetail(parts[1], parts[2] || 'balance-check')
      title = guideObj.seoTitle
      description = guideObj.seoDescription
    } else if (parts[0] === 'pakistan') {
      const providerName = parts[1] ? parts[1].toUpperCase() : 'Pakistan'
      title = `${providerName} Telecom Utility Guides | ToolNest`
      description = `Useful telecom guides for ${providerName} balance checks, internet MBs, SIM ownership, and USSD codes.`
    } else if (route === '/popular') {
      title = 'Popular Free Online Tools | ToolNest'
      description = 'Use ToolNest popular free online tools for PDF to PPT, text, image, calculator, and developer tasks.'
    } else if (route === '/about') {
      title = 'About ToolNest - Fast, Private Online Utilities'
      description = 'ToolNest is an independent digital toolbox providing high-performance browser utilities and verified Pakistan telecom guides.'
    } else if (route === '/contact') {
      title = 'Contact ToolNest - Support & Feedback'
      description = 'Contact ToolNest team for feedback, feature suggestions, bug reports, or partnership inquiries.'
    } else if (route === '/privacy') {
      title = 'Privacy Policy | ToolNest'
      description = 'ToolNest Privacy Policy. Learn about our browser local storage privacy model and Google AdSense cookie guidelines.'
    } else if (route === '/terms') {
      title = 'Terms of Service | ToolNest'
      description = 'Terms of Service governing the use of ToolNest free online tools and utility guides.'
    } else if (route === '/disclaimer') {
      title = 'Legal & Telecom Disclaimer | ToolNest'
      description = 'ToolNest legal disclaimer regarding telecom guides and browser-based utility tools.'
    } else if (route === '/sitemap') {
      title = 'HTML Sitemap | ToolNest'
      description = 'Complete directory of all 70+ online tools, categories, and Pakistan utility guides on ToolNest.'
    }

    document.title = title

    const metaDescElem = document.querySelector('meta[name="description"]')
    if (metaDescElem) metaDescElem.setAttribute('content', description)

    const metaKwElem = document.querySelector('meta[name="keywords"]')
    if (metaKwElem) metaKwElem.setAttribute('content', keywords)

    const canonicalElem = document.querySelector('link[rel="canonical"]')
    if (canonicalElem) canonicalElem.setAttribute('href', `${SITE_URL}${route}${searchQueryParam ? `?q=${encodeURIComponent(searchQueryParam)}` : ''}`)

    const metaOgTitle = document.querySelector('meta[property="og:title"]')
    if (metaOgTitle) metaOgTitle.setAttribute('content', title)

    const metaOgDesc = document.querySelector('meta[property="og:description"]')
    if (metaOgDesc) metaOgDesc.setAttribute('content', description)

    const metaOgUrl = document.querySelector('meta[property="og:url"]')
    if (metaOgUrl) metaOgUrl.setAttribute('content', `${SITE_URL}${route}`)

    // Schema.org Graph
    const faqEntries = isTelenorQuiz
      ? [
          { question: 'How do I find the My Telenor daily quiz?', answer: 'Open the official My Telenor app, sign in with your Telenor number, then look for Play and Win or Test Your Skills.' },
          { question: 'Are these answers guaranteed by Telenor?', answer: 'No. This independent guide reports answers for convenience. Confirm each question in the official app.' }
        ]
      : currentTool
      ? getToolFaqs(currentTool)
      : [
          { question: 'Are the tools on ToolNest free?', answer: 'Yes. ToolNest offers 100% free online tools without subscription fees.' },
          { question: 'Does ToolNest require an account or registration?', answer: 'No. Every tool is available immediately without signing in.' },
        ]

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'ToolNest',
          url: `${SITE_URL}/`,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': currentTool ? 'WebApplication' : 'WebPage',
          name: title,
          url: `${SITE_URL}${route}`,
          description: description,
          isPartOf: { '@type': 'WebSite', name: 'ToolNest', url: `${SITE_URL}/` },
          ...(currentTool ? {
            applicationCategory: isPdfToPpt ? 'BusinessApplication' : currentTool.category,
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
          } : {})
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
  }, [route, searchQueryParam])

  // Page Routing Logic
  let page = <Home />

  const pathParts = route.split('/').filter(Boolean)

  if (route === '/search' || searchQueryParam) {
    page = <SearchPage initialQuery={searchQueryParam} />
  } else if (pathParts[0] === 'tools' && pathParts[1]) {
    page = <ToolPage slug={pathParts[1]} />
  } else if (route === '/popular') {
    page = <PopularPage />
  } else if (pathParts[0] === 'category' && pathParts[1]) {
    page = <CategoryPage slug={pathParts[1]} />
  } else if (route === '/pakistan/telenor/quiz-today') {
    page = <TelenorQuizPage />
  } else if (pathParts[0] === 'pakistan') {
    if (pathParts.length === 3) {
      page = <PakistanGuidePage providerSlug={pathParts[1]} guideSlug={pathParts[2]} />
    } else {
      page = <PakistanPage path={route} />
    }
  } else if (route === '/about') {
    page = <AboutPage />
  } else if (route === '/contact') {
    page = <ContactPage />
  } else if (route === '/privacy') {
    page = <PrivacyPolicyPage />
  } else if (route === '/terms') {
    page = <TermsPage />
  } else if (route === '/disclaimer') {
    page = <DisclaimerPage />
  } else if (route === '/sitemap') {
    page = <SitemapPage />
  }

  return (
    <ToastProvider>
      <div className="app-shell">
        <header className="site-header">
          <div className="header-inner">
            <Link to="/" className="brand">
              <span className="brand-mark"><Sparkles size={18} /></span>
              tool<span>nest</span>
            </Link>
            <nav className={`main-nav ${menu ? 'open' : ''}`}>
              <Link to="/">All Tools</Link>
              <Link to="/tools/pdf-to-ppt">PDF to PPT</Link>
              <Link to="/category/pdf-tools">PDF Tools</Link>
              <Link to="/category/calculator-tools">Calculators</Link>
              <Link to="/pakistan">Pakistan</Link>
              <Link to="/popular">Popular</Link>
              <Link to="/about">About</Link>
            </nav>
            <div className="header-actions">
              <button
                type="button"
                className="header-search-btn"
                onClick={() => setCmdOpen(true)}
                aria-label="Search tools"
              >
                <Search size={18} />
                <span>Search tools...</span>
                <kbd>⌘ K</kbd>
              </button>
              <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
                {dark ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">
                {menu ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </header>

        <main>{page}</main>

        <Footer />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      </div>
    </ToastProvider>
  )
}

function SearchPage({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const navigate = useNavigate()

  const matchedTools = useMemo(() => {
    if (!query.trim()) return tools
    const q = query.toLowerCase()
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
  }, [query])

  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return matchedTools
    return matchedTools.filter((t) => slugify(t.category) === selectedCategory)
  }, [matchedTools, selectedCategory])

  const matchedGuides = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return PROVIDERS.flatMap((p) =>
      GUIDE_TYPES.map((g) => ({
        provider: p.name,
        providerSlug: p.slug,
        guideName: g.name,
        guideSlug: g.slug,
        title: `${p.name} ${g.name}`,
        color: p.color,
      }))
    ).filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.provider.toLowerCase().includes(q) ||
        g.guideName.toLowerCase().includes(q)
    )
  }, [query])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="search-page-wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Search</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">SEARCH TOOLNEST</div>
        <h1>Search Results {query ? `for "${query}"` : ''}</h1>
        <p>Explore tools, file converters, financial calculators, and Pakistan utility guides.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="hero-search-wrap" style={{ margin: '0 0 24px', maxWidth: '100%' }}>
        <Search size={22} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for PDF to PPT, Image Compressor, Loan Calculator, Jazz Balance..."
          aria-label="Search inputs"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <X size={18} />
          </button>
        )}
        <button type="submit" className="button button-primary btn-sm">Search</button>
      </form>

      {/* Category Filter Chips */}
      <div className="search-filters-row">
        <button
          type="button"
          className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All ({matchedTools.length + (selectedCategory === 'all' ? matchedGuides.length : 0)})
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`filter-chip ${selectedCategory === c.slug ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Pakistan Guide Results if matched */}
      {matchedGuides.length > 0 && (selectedCategory === 'all' || selectedCategory === 'pakistan') && (
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} className="text-emerald" /> Pakistan Utility Guides ({matchedGuides.length})
          </h2>
          <div className="guide-links-grid">
            {matchedGuides.map((g) => (
              <Link
                to={`/pakistan/${g.providerSlug}/${g.guideSlug}`}
                key={`${g.providerSlug}-${g.guideSlug}`}
                className="guide-link-card"
              >
                <span>{g.title}</span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tools Grid */}
      <section>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
          Tools & Utilities ({filteredTools.length})
        </h2>
        {filteredTools.length > 0 ? (
          <div className="tool-grid">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileSearch size={40} style={{ color: 'var(--muted)', margin: 'auto' }} />
            <h3>No tools found</h3>
            <p style={{ color: 'var(--muted)' }}>Try searching with a different keyword like &quot;PDF&quot;, &quot;Compress&quot;, or &quot;Calculate&quot;.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function PopularPage() {
  return (
    <div className="page-wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Popular</span>
      </nav>
      <div className="page-intro">
        <div className="eyebrow">POPULAR TOOLS</div>
        <h1>Start with the essentials</h1>
        <p>Fast, fully functional browser tools for documents, images, code, and calculations.</p>
      </div>
      <div className="tool-grid">
        {tools.filter((tool) => tool.popular).map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  )
}

function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!query) return []
    return tools.filter((tool) => `${tool.name} ${tool.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
  }, [query])

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="eyebrow">
          <span className="live-dot" /> Free online tools · 100% private · No registration required
        </div>
        <h1>Free Online Tools for PDF to PPT, Images, Code & Calculations</h1>
        <p className="hero-copy">
          Convert PDF to PPT online for free with editable slides, compress images, count words, format JSON, and run financial calculators in seconds. Everything runs privately in your browser.
        </p>

        <form onSubmit={handleHeroSearch} className="hero-search-wrap">
          <Search size={22} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 30+ tools (e.g. PDF to PPT, Image Compressor, JSON, Jazz Balance)..."
            aria-label="Search for a tool"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={18} />
            </button>
          )}
          <span className="search-shortcut">⌘ K</span>

          {results.length > 0 && (
            <div className="search-results">
              {results.map((tool) => (
                <Link to={`/tools/${tool.slug}`} key={tool.slug}>
                  <tool.icon size={18} />
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.category}</small>
                  </span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          )}
        </form>

        <div className="hero-trust">
          <span><Check size={16} /> 100% Free & Unlimited</span>
          <span><Check size={16} /> No Email or Account</span>
          <span><Check size={16} /> Client-Side Privacy</span>
        </div>
      </section>

      {/* Responsive AdSlot */}
      <div className="section" style={{ padding: '24px 28px 0' }}>
        <AdSlot label="Advertisement" />
      </div>

      <section className="section">
        <SectionHeading eyebrow="FEATURED TOOL" title="Convert PDF to PowerPoint Presentation Online" />
        <div className="featured-guide" style={{ background: 'var(--green-light)', borderColor: '#bce1ce', padding: '24px 28px' }}>
          <div>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '6px' }}>PDF to PPT Converter (Free Online)</strong>
            <span style={{ fontSize: '15px', color: 'var(--muted)' }}>
              Turn PDF documents into editable Microsoft PowerPoint (.pptx) slides with preserved hierarchy, custom themes, and instant download.
            </span>
          </div>
          <Link to="/tools/pdf-to-ppt" className="button button-primary">
            Convert PDF to PPT Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="START HERE" title="Popular free online tools" />
        <div className="tool-grid">
          {tools.filter((tool) => tool.popular).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="section category-section">
        <SectionHeading eyebrow="EXPLORE BY NEED" title="Browse tool categories" />
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="section utility-band">
        <div>
          <div className="eyebrow">MADE FOR PAKISTAN</div>
          <h2>Everyday telecom answers,<br /><em>without the guesswork.</em></h2>
          <p>
            Quick, reliable guides for checking telecom balances, active internet MBs, SIM ownership, and packages across Pakistan&apos;s leading networks.
          </p>
          <Link to="/pakistan" className="button button-dark">
            Explore Pakistan guides <ArrowRight size={16} />
          </Link>
        </div>
        <div className="provider-stack">
          {providers.map((provider, index) => (
            <Link to={`/pakistan/${provider.toLowerCase()}`} className="provider-row" key={provider}>
              <span className={`provider-logo p-${index}`}>{provider[0]}</span>
              <span>
                <strong>{provider} Telecom Guides</strong>
                <small>8 quick utility guides</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading eyebrow="GOOD TO KNOW" title="Frequently asked questions" />
        <FAQ items={[
          ['Are ToolNest tools really 100% free?', 'Yes. Every tool on ToolNest is free to use with no limits, hidden paywalls, or subscriptions.'],
          ['Do you upload my PDF or private files to any server?', 'No. Our browser-based tools process documents and images locally on your device for complete privacy.'],
          ['Can I convert PDF to PPT on my mobile phone?', 'Yes. ToolNest works seamlessly on all modern mobile and desktop browsers including Chrome, Safari, and Edge.']
        ]} />
      </section>
    </>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  return (
    <Link to={`/tools/${tool.slug}`} className="tool-card">
      <div className="card-icon">
        <Icon size={22} />
      </div>
      <div>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
        <span className="card-link">
          Open tool <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

function CategoryCard({ category }: { category: typeof categories[number] }) {
  const Icon = category.icon
  const href = category.slug === 'pakistan' ? '/pakistan' : `/category/${category.slug}`
  return (
    <Link to={href} className={`category-card tone-${category.tone}`}>
      <span className="category-icon">
        <Icon size={22} />
      </span>
      <span>
        <strong>{category.name}</strong>
        <small>{category.count} tools</small>
      </span>
      <ArrowRight size={18} />
    </Link>
  )
}

function FAQ({ items }: { items: [string, string][] }) {
  return (
    <div className="faq-list">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>
            {question}
            <ChevronDown size={18} />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  )
}

function CategoryPage({ slug }: { slug: string }) {
  const category = categories.find((item) => item.slug === slug)
  const list = tools.filter((tool) => slugify(tool.category) === slug)

  return (
    <div className="page-wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ {category?.name || 'Category'}</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">TOOL COLLECTION</div>
        <h1>{category?.name || 'Online Tools'}</h1>
        <p>Simple, powerful, and private tools designed to get real work done in your browser.</p>
      </div>

      <div className="tool-grid">
        {list.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  )
}

function ToolPage({ slug }: { slug: string }) {
  const tool = toolBySlug(slug)
  if (!tool) return <NotFound />
  return <ToolContent tool={tool} />
}

function ToolContent({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  const isPdfToPpt = tool.slug === 'pdf-to-ppt'

  return (
    <div className="page-wrap tool-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/category/${slugify(tool.category)}`}>{tool.category}</Link>
        <span>/ {tool.name}</span>
      </nav>

      <div className="tool-layout">
        <article>
          <div className="tool-title">
            <div className="tool-title-icon">
              <Icon size={26} />
            </div>
            <div>
              <div className="eyebrow">{tool.category.toUpperCase()}</div>
              <h1>{tool.name}</h1>
              <p>{tool.description}</p>
            </div>
          </div>

          {/* Interactive functional tool workspace */}
          <ToolDispatcher tool={tool} />

          {/* Tool Feedback & Bookmark bar */}
          <ToolFeedback toolSlug={tool.slug} toolName={tool.name} />

          {/* SEO Rich article content */}
          {isPdfToPpt ? <PdfToPptArticle /> : <ToolArticle tool={tool} />}
        </article>

        <aside>
          <AdSlot label="Advertisement" />
          <div className="side-note">
            <ShieldCheck size={22} />
            <strong>Private by Design</strong>
            <p>Processed client-side in your browser. We never see, store, or sell your files.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function PakistanPage({ path }: { path: string }) {
  const providerSlug = path.split('/')[2] || ''
  const providerObj = PROVIDERS.find((p) => p.slug === providerSlug)
  const name = providerObj ? providerObj.name : ''

  return (
    <div className="page-wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Pakistan Utilities</span>
        {name && <span>/ {name}</span>}
      </nav>

      <div className="page-intro">
        <div className="eyebrow">PAKISTAN TELECOM GUIDES</div>
        <h1>{name ? `${name} Telecom Guides` : 'Useful Telecom Guides for Pakistan'}</h1>
        <p>
          Practical, easy-to-read guides for checking telecom services, checking account balances, USSD codes, and internet packages.
        </p>
      </div>

      {(providerSlug === 'telenor' || !providerSlug) && (
        <Link to="/pakistan/telenor/quiz-today" className="featured-guide">
          <div>
            <strong>My Telenor Quiz Today</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
              Reported answers, access steps, and reward guidance
            </p>
          </div>
          <ArrowRight size={18} />
        </Link>
      )}

      {providerSlug ? (
        <div className="provider-grid">
          {GUIDE_TYPES.map((g) => (
            <Link
              to={`/pakistan/${providerSlug}/${g.slug}`}
              className="guide-card"
              key={g.slug}
            >
              <span className="guide-number" style={{ background: `${providerObj?.color}20`, color: providerObj?.color }}>
                {g.name[0]}
              </span>
              <span>
                <strong>{name} {g.name}</strong>
                <small>USSD code, SMS & app steps</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="provider-grid">
          {PROVIDERS.map((p) => (
            <Link to={`/pakistan/${p.slug}`} className="guide-card" key={p.slug}>
              <span className="guide-number" style={{ background: `${p.color}20`, color: p.color }}>
                {p.name[0]}
              </span>
              <span>
                <strong>{p.name} Telecom Guides</strong>
                <small>8 utility guides & USSD codes</small>
              </span>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      )}

      <div className="update-note">
        <ShieldCheck size={22} />
        <div>
          <strong>Regularly Reviewed Information</strong>
          <p>
            Telecom codes, packages, and support numbers are maintained for clarity. Please verify final terms with your provider.
          </p>
        </div>
      </div>
    </div>
  )
}

function TelenorQuizPage() {
  const questions: [string, string][] = [
    ['Which sea creature can release ink when threatened?', 'Squid'],
    ['Which animal can produce an electric shock?', 'Electric eel'],
    ['Which animal can climb smooth walls?', 'Gecko'],
    ['Which animal spins a web to catch its food?', 'Spider'],
    ['Which insect can carry objects many times its body weight?', 'Ant']
  ]

  return (
    <div className="page-wrap article-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/pakistan">Pakistan</Link>
        <span>/</span>
        <Link to="/pakistan/telenor">Telenor</Link>
        <span>/ Quiz today</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">UPDATED DAILY</div>
        <h1>My Telenor Quiz Today: Answers</h1>
        <p>
          Reported answers for the daily My Telenor quiz, plus clear steps for finding the quiz and checking rewards in the official app.
        </p>
      </div>

      <div className="article-content">
        <div className="update-note">
          <ShieldCheck size={22} />
          <div>
            <strong>Independent guide</strong>
            <p>
              ToolNest is not affiliated with Telenor Pakistan. Questions, answers, and rewards can change, so verify them in the My Telenor app before submitting.
            </p>
          </div>
        </div>

        <h2>My Telenor answers today</h2>
        <div className="quiz-answer-list">
          {questions.map(([question, answer], index) => (
            <div className="quiz-answer" key={question}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{question}</strong>
                <p>
                  Correct answer: <b>{answer}</b>
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2>What is the Telenor daily quiz?</h2>
        <p>
          The My Telenor quiz is a short question-and-answer feature in the app, often shown under Play and Win or Test Your Skills. It covers general knowledge, science, history, and technology.
        </p>

        <h2>How to play the quiz</h2>
        <ol>
          <li>Install or open the official My Telenor app.</li>
          <li>Sign in with your Telenor number and complete verification.</li>
          <li>Open Play and Win or Test Your Skills from the home screen.</li>
          <li>Answer all five multiple-choice questions carefully.</li>
          <li>Check the reward screen after submitting.</li>
        </ol>

        <h2>Frequently asked questions</h2>
        <FAQ
          items={[
            ['How do I participate in My Telenor Quiz Today?', 'Open the official My Telenor app, sign in, and look for Play and Win or Test Your Skills.'],
            ['Can non-Telenor users take part?', 'Eligibility is controlled by Telenor and may vary.'],
            ['How many times can I play per day?', 'The quiz is commonly available once per day.'],
            ['Is ToolNest affiliated with Telenor?', 'No. ToolNest is an independent informational website and is not endorsed or sponsored by Telenor Pakistan.']
          ]}
        />
      </div>
    </div>
  )
}

function AdSlot({ label }: { label: string }) {
  useEffect(() => {
    try {
      // @ts-expect-error Google AdSense push
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // ignore if adblocker or local dev
    }
  }, [])

  return (
    <div className="ad-slot">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-2607800826981704"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <span style={{ position: 'absolute', opacity: 0.5 }}>{label}</span>
    </div>
  )
}

function NotFound() {
  return (
    <div className="page-wrap empty-state" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <FileSearch size={48} style={{ color: 'var(--green)', margin: 'auto' }} />
      <h1 style={{ fontSize: '38px', margin: '20px 0 10px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
        The tool or guide you are looking for does not exist or has moved.
      </p>
      <Link to="/" className="button button-primary">
        Back to Home
      </Link>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <Link to="/" className="brand">
            tool<span>nest</span>
          </Link>
          <p>
            Fast, private, and free online utilities for modern workflows.<br />
            Transform documents, compress images, and calculate instantly.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Top Tools</strong>
            <Link to="/tools/pdf-to-ppt">PDF to PPT Converter</Link>
            <Link to="/tools/image-compressor">Image Compressor</Link>
            <Link to="/tools/word-counter">Word Counter</Link>
            <Link to="/tools/percentage-calculator">Percentage Calculator</Link>
          </div>
          <div>
            <strong>Categories</strong>
            <Link to="/category/pdf-tools">PDF Tools</Link>
            <Link to="/category/image-tools">Image Tools</Link>
            <Link to="/category/developer-tools">Developer Tools</Link>
            <Link to="/pakistan">Pakistan Guides</Link>
          </div>
          <div>
            <strong>Company</strong>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ToolNest. Built for real work. All rights reserved.</span>
        <span>Runs 100% locally in your browser.</span>
      </div>
    </footer>
  )
}

export default App
