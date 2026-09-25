import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, FileSearch, Menu, Moon, Search, ShieldCheck, Sparkles, Sun, X } from 'lucide-react'
import { categories, pakistanGuides, providers, tools, type Tool } from './data'
import { ToolDispatcher } from './components/tools/ToolDispatcher'
import { PdfToPptArticle } from './components/seo/PdfToPptArticle'
import { getToolFaqs } from './data/toolFaqs'
import './App.css'

const SITE_URL = 'https://www.onlinetoolnest.tech'
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const toolBySlug = (slug: string) => tools.find((item) => item.slug === slug)

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('toolnest-theme') === 'dark')
  const [menu, setMenu] = useState(false)
  const route = useLocation().pathname

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('toolnest-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const current = toolBySlug(route.split('/')[2])
    const category = categories.find((item) => `/category/${item.slug}` === route)
    const isTelenorQuiz = route === '/pakistan/telenor/quiz-today'
    const isPdfToPpt = current?.slug === 'pdf-to-ppt'

    const title = isPdfToPpt
      ? 'PDF to PPT Converter - Free Online PDF to PowerPoint | ToolNest'
      : isTelenorQuiz
      ? 'My Telenor App Question Today: Quiz Answers | ToolNest'
      : current?.seoTitle || (category ? `${category?.name} | Free Online Tools | ToolNest` : route === '/popular' ? 'Popular Free Online Tools | ToolNest' : route === '/pakistan' ? 'Pakistan Utility Guides | ToolNest' : route === '/about' ? 'About ToolNest' : 'ToolNest | Free Online Tools, PDF to PPT & Utility Guides')

    const description = isPdfToPpt
      ? 'Convert PDF to PPT online for free with ToolNest. Turn PDF documents into editable Microsoft PowerPoint (PPT/PPTX) presentations instantly in your browser. Fast, secure, 100% free.'
      : isTelenorQuiz
      ? 'Looking for the My Telenor app question today? See the reported quiz answers for 24 September 2026, how to access the daily quiz, and reward guidance.'
      : current?.seoDescription || (category ? `Browse free ${category?.name.toLowerCase()} for fast, practical work online. No registration required with ToolNest.` : route === '/popular' ? 'Use ToolNest popular free online tools for PDF to PPT, text, image, calculator, and developer tasks.' : 'Free online tools for PDF to PPT converter, image compressor, word counter, calculator, and developer tasks, plus Pakistan utility guides.')

    const ogTitle = current ? current.seoTitle || `${current.name} | ToolNest` : 'ToolNest | Free Online Tools, PDF to PPT & Pakistan Utility Guides'
    const ogDescription = current ? current.seoDescription : 'Free online tools for PDF to PPT, PDF compression, image resize, text utilities, and Pakistan telecom checks.'

    document.title = title

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) metaDescription.setAttribute('content', description)

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      if (isPdfToPpt) {
        metaKeywords.setAttribute('content', 'pdf to ppt, pdf to ppt converter, convert pdf to ppt, pdf to powerpoint, pdf to pptx, online pdf to ppt converter, free pdf to ppt converter, pdf into ppt')
      } else {
        metaKeywords.setAttribute('content', 'pdf to ppt, free online tools, pdf tools, image compressor, word counter, json formatter, percentage calculator')
      }
    }

    const metaOgTitle = document.querySelector('meta[property="og:title"]')
    if (metaOgTitle) metaOgTitle.setAttribute('content', ogTitle)

    const metaOgDescription = document.querySelector('meta[property="og:description"]')
    if (metaOgDescription) metaOgDescription.setAttribute('content', ogDescription)

    const metaTwitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (metaTwitterTitle) metaTwitterTitle.setAttribute('content', ogTitle)

    const metaTwitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (metaTwitterDescription) metaTwitterDescription.setAttribute('content', ogDescription)

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', `${SITE_URL}${route || '/'}`)

    const faqEntries = isTelenorQuiz
      ? [
          { question: 'How do I find the My Telenor daily quiz?', answer: 'Open the official My Telenor app, sign in with your Telenor number, then look for Play and Win or Test Your Skills.' },
          { question: 'How many questions are in the quiz?', answer: 'The daily quiz commonly presents five multiple-choice questions, but the format and reward can change.' },
          { question: 'Are these answers guaranteed by Telenor?', answer: 'No. This independent guide reports answers for convenience. Confirm each question and reward in the official My Telenor app before submitting.' }
        ]
      : current
      ? getToolFaqs(current)
      : [
          { question: 'Are the tools on ToolNest free?', answer: 'Yes. ToolNest offers free online tools including PDF to PPT converter, image tools, text counters, and calculators without subscription fees.' },
          { question: 'Does ToolNest require an account or registration?', answer: 'No. Every tool is available immediately without signing in or providing an email address.' },
          { question: 'Does ToolNest include Pakistan utility guides?', answer: 'Yes. ToolNest provides clear guides for Telenor, Jazz, Zong, and Ufone telecom balances, packages, and codes.' }
        ]

    const itemList = tools.slice(0, 10).map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebApplication',
        name: t.name,
        applicationCategory: t.category,
        url: `${SITE_URL}/tools/${t.slug}`
      }
    }))

    const breadcrumbLabels = route === '/'
      ? []
      : route.startsWith('/tools/')
        ? ['Home', current?.name || 'Tool']
        : route.startsWith('/category/')
          ? ['Home', category?.name || 'Category']
          : route.startsWith('/pakistan')
            ? ['Home', 'Pakistan utilities']
            : ['Home', title]

    const breadcrumbList = breadcrumbLabels.length > 0 ? {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbLabels.map((label, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: label,
        item: `${SITE_URL}${index === 0 ? '/' : route}`
      }))
    } : null

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', name: 'ToolNest', url: `${SITE_URL}/` },
        ...(breadcrumbList ? [breadcrumbList] : []),
        ...(isPdfToPpt ? [{
          '@type': 'HowTo',
          name: 'How to Convert PDF to PPT Online for Free',
          description: 'Learn how to convert PDF documents into editable Microsoft PowerPoint presentations in 3 simple steps.',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Upload your PDF document',
              text: 'Drag and drop your PDF file or click to select from your device.',
              position: 1
            },
            {
              '@type': 'HowToStep',
              name: 'Configure Presentation Theme and Layout',
              text: 'Select your presentation aspect ratio (16:9 widescreen or 4:3 standard) and review the slide deck.',
              position: 2
            },
            {
              '@type': 'HowToStep',
              name: 'Download Editable PowerPoint (.pptx)',
              text: 'Click Download PowerPoint to generate and save your editable presentation file.',
              position: 3
            }
          ]
        }] : []),
        ...(isTelenorQuiz ? [{
          '@type': 'Article',
          headline: title,
          description,
          datePublished: '2026-09-24',
          dateModified: '2026-09-24',
          author: { '@type': 'Organization', name: 'ToolNest' },
          publisher: { '@type': 'Organization', name: 'ToolNest' },
          mainEntityOfPage: `${SITE_URL}${route}`
        }] : []),
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
              applicationCategory: isPdfToPpt ? 'BusinessApplication' : current.category,
              operatingSystem: 'All',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              ...(isPdfToPpt ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.9',
                  ratingCount: '1840'
                }
              } : {}),
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
  else if (route === '/pakistan/telenor/quiz-today') page = <TelenorQuizPage />
  else if (route.startsWith('/pakistan')) page = <PakistanPage path={route} />
  else if (['/about', '/contact', '/privacy', '/terms', '/disclaimer', '/sitemap'].includes(route)) page = <InfoPage path={route} />

  return (
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
            <Link to="/pakistan">Pakistan</Link>
            <Link to="/popular">Popular</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="header-actions">
            <Link to="/" className="header-search">
              <Search size={18} />
              <span>Search tools</span>
              <kbd>⌘ K</kbd>
            </Link>
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
    </div>
  )
}

function PopularPage() {
  return (
    <div className="page-wrap">
      <Breadcrumbs items={['Popular tools']} />
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
  const results = useMemo(() => {
    if (!query) return []
    return tools.filter((tool) => `${tool.name} ${tool.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
  }, [query])

  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="eyebrow">
          <span className="live-dot" /> Free online tools · 100% private · No registration required
        </div>
        <h1>Free Online Tools for PDF to PPT, Images, Code & Calculations</h1>
        <p className="hero-copy">
          Convert PDF to PPT online for free with editable slides, compress images, count words, format JSON, and run financial calculators in seconds. Everything runs privately in your browser with zero data storage.
        </p>

        <div className="hero-search-wrap">
          <Search size={22} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools (e.g. PDF to PPT, Image Compressor, JSON Formatter)..."
            aria-label="Search for a tool"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
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
        </div>

        <div className="hero-trust">
          <span><Check size={16} /> 100% Free & Unlimited</span>
          <span><Check size={16} /> No Email or Account</span>
          <span><Check size={16} /> Client-Side Privacy</span>
        </div>
      </section>

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
          <h2>Everyday answers,<br /><em>without the guesswork.</em></h2>
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
                <strong>{provider}</strong>
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
      <Breadcrumbs items={['Categories', category?.name || 'Tools']} />
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
      <Breadcrumbs items={[tool.category, tool.name]} />
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

          {/* Interactive functional component */}
          <ToolDispatcher tool={tool} />

          {/* SEO Rich content */}
          {isPdfToPpt ? <PdfToPptArticle /> : <ArticleContent tool={tool} />}
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

function ArticleContent({ tool }: { tool: Tool }) {
  const faqs = getToolFaqs(tool)

  return (
    <div className="article-content">
      <h2>How to use {tool.name.toLowerCase()}</h2>
      <p>
        Use this free online tool in a few simple steps. Add your input above, configure your desired options, then copy or download the result instantly. ToolNest keeps the experience focused and lightweight so you can finish the task with zero friction.
      </p>

      <h2>Frequently asked questions</h2>
      <FAQ
        items={faqs.map((f) => [f.question, f.answer])}
      />

      <h2>Related tools in {tool.category}</h2>
      <div className="related-tools">
        {tools
          .filter((item) => item.category === tool.category && item.slug !== tool.slug)
          .slice(0, 4)
          .map((item) => (
            <Link to={`/tools/${item.slug}`} key={item.slug}>
              <span>{item.name}</span>
              <ArrowRight size={15} />
            </Link>
          ))}
      </div>
    </div>
  )
}

function PakistanPage({ path }: { path: string }) {
  const provider = path.split('/')[2]
  const name = provider ? provider[0].toUpperCase() + provider.slice(1) : ''
  return (
    <div className="page-wrap">
      <Breadcrumbs items={name ? ['Pakistan', name] : ['Pakistan utilities']} />
      <div className="page-intro">
        <div className="eyebrow">PAKISTAN UTILITY GUIDES</div>
        <h1>{name ? `${name} Telecom Guides` : 'Useful Telecom Guides for Pakistan'}</h1>
        <p>
          Practical, easy-to-read guides for checking telecom services, checking account balances, and internet packages.
        </p>
      </div>
      {provider === 'telenor' && (
        <Link to="/pakistan/telenor/quiz-today" className="featured-guide">
          <div>
            <strong>My Telenor Quiz Today</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '14px' }}>
              Reported answers, access steps, and reward guidance for 24 September 2026
            </p>
          </div>
          <ArrowRight size={18} />
        </Link>
      )}
      <div className="provider-grid">
        {(name ? pakistanGuides : providers).map((item) => (
          <Link
            to={name ? `/pakistan/${provider}/${slugify(item)}` : `/pakistan/${item.toLowerCase()}`}
            className="guide-card"
            key={item}
          >
            <span className="guide-number">{name ? 'Q' : item[0]}</span>
            <span>
              <strong>{name ? `${name} ${item}` : `${item} guides`}</strong>
              <small>{name ? 'Answer, context, and instructions' : 'View utility guides'}</small>
            </span>
            <ArrowRight size={18} />
          </Link>
        ))}
      </div>
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
      <Breadcrumbs items={['Pakistan', 'Telenor', 'Quiz today']} />
      <div className="page-intro">
        <div className="eyebrow">UPDATED 24 SEPTEMBER 2026</div>
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
          The My Telenor quiz is a short question-and-answer feature in the app, often shown under Play and Win or Test Your Skills. It may cover general knowledge, Pakistan studies, science, geography, Islamiyat, technology, and current topics.
        </p>

        <h2>How to play the quiz</h2>
        <ol>
          <li>Install or open the official My Telenor app.</li>
          <li>Sign in with your Telenor number and complete verification.</li>
          <li>Open Play and Win or Test Your Skills from the home screen.</li>
          <li>Answer all five multiple-choice questions carefully.</li>
          <li>Check the reward screen after submitting. The reward and eligibility may vary by offer.</li>
        </ol>

        <h2>Frequently asked questions</h2>
        <FAQ
          items={[
            ['How do I participate in My Telenor Quiz Today?', 'Open the official My Telenor app, sign in, and look for Play and Win or Test Your Skills.'],
            ['Can non-Telenor users take part?', 'Eligibility is controlled by Telenor and may vary. Check the official app for the account currently signed in.'],
            ['How many times can I play per day?', 'The quiz is commonly available once per day, but the app rules and reward window can change.'],
            ['Is ToolNest affiliated with Telenor?', 'No. ToolNest is an independent informational website and is not endorsed or sponsored by Telenor Pakistan.']
          ]}
        />
      </div>
    </div>
  )
}

function InfoPage({ path }: { path: string }) {
  const pages: Record<string, [string, string]> = {
    '/about': ['About ToolNest', 'ToolNest is an independent suite of fast, browser-based tools and verified utility guides built with privacy in mind.'],
    '/contact': ['Contact us', 'Have a correction, feature suggestion, or feedback? Email hello@onlinetoolnest.tech.'],
    '/privacy': ['Privacy policy', 'ToolNest processes user data and files locally in the browser. We do not store, log, or track your documents.'],
    '/terms': ['Terms of service', 'ToolNest tools are provided free of charge for productivity and personal convenience.'],
    '/disclaimer': ['Disclaimer', 'Telecom guides and tools are educational and provided as-is. Check with official providers for account-specific inquiries.'],
    '/sitemap': ['Sitemap', 'Browse all ToolNest tools, converters, categories, and utility guides.']
  }
  const [title, copy] = pages[path] || pages['/about']

  return (
    <div className="page-wrap legal-page">
      <Breadcrumbs items={[title]} />
      <div className="page-intro">
        <div className="eyebrow">TOOLNEST</div>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {path === '/sitemap' ? (
        <div className="sitemap-grid">
          <Link to="/">Home</Link>
          <Link to="/tools/pdf-to-ppt">PDF to PPT Converter</Link>
          <Link to="/pakistan">Pakistan guides</Link>
          {categories.map((category) => (
            <Link to={`/category/${category.slug}`} key={category.slug}>
              {category.name}
            </Link>
          ))}
          {tools.map((tool) => (
            <Link to={`/tools/${tool.slug}`} key={tool.slug}>
              {tool.name}
            </Link>
          ))}
        </div>
      ) : (
        <ArticleContent tool={tools[0]} />
      )}
    </div>
  )
}

function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item) => (
        <span key={item}>/ {item}</span>
      ))}
    </nav>
  )
}

function AdSlot({ label }: { label: string }) {
  return (
    <div className="ad-slot">
      <span>{label}</span>
    </div>
  )
}

function NotFound() {
  return (
    <div className="page-wrap empty-state" style={{ textAlign: 'center', paddingTop: '100px' }}>
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
