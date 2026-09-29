import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Shield, CheckCircle, Send, Globe, ShieldCheck, HelpCircle, FileText, Smartphone } from 'lucide-react'
import { tools, categories } from '../../data'
import { PROVIDERS, GUIDE_TYPES } from '../../data/pakistanGuidesData'
import { useToast } from '../common/Toast'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Feedback')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !message) {
      showToast('Please fill out all required fields.', '', 'error')
      return
    }
    setSubmitted(true)
    showToast('Thank you! Your message has been sent successfully.', '', 'success')
  }

  return (
    <div className="page-wrap legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Contact Us</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">GET IN TOUCH</div>
        <h1>Contact ToolNest</h1>
        <p>
          Have questions, bug reports, feature requests, or business inquiries? We would love to hear from you.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <Mail size={32} className="text-emerald" style={{ marginBottom: '16px' }} />
          <h2>Email Us Directly</h2>
          <p>For support, corrections, or media inquiries, send us an email:</p>
          <a href="mailto:hello@onlinetoolnest.tech" className="contact-email-link">
            hello@onlinetoolnest.tech
          </a>

          <hr style={{ margin: '24px 0', borderColor: 'var(--border)' }} />

          <ShieldCheck size={28} className="text-emerald" style={{ marginBottom: '12px' }} />
          <h3>Response Time</h3>
          <p>We typically review and respond to user messages within 24–48 business hours.</p>
        </div>

        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success-state">
              <CheckCircle size={48} className="text-emerald" style={{ margin: 'auto' }} />
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out to ToolNest. We have received your inquiry and will respond shortly.</p>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setSubmitted(false)
                  setMessage('')
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send us a Message</h2>

              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Telecom Guide Correction">Telecom Guide Correction</option>
                  <option value="AdSense / Partnership Inquiry">AdSense / Partnership Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                />
              </div>

              <button type="submit" className="button button-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export function PrivacyPolicyPage() {
  return (
    <div className="page-wrap legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Privacy Policy</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">LAST UPDATED: 2026</div>
        <h1>Privacy Policy</h1>
        <p>
          At ToolNest (accessible from https://www.onlinetoolnest.tech), one of our main priorities is the privacy of our visitors.
        </p>
      </div>

      <div className="article-content">
        <h2>1. Client-Side Processing Privacy Guarantee</h2>
        <p>
          ToolNest provides web-based productivity tools including PDF to PPT converters, image compressors, word counters, code formatters, and calculators. All file transformations and data processing occur strictly inside your web browser (client-side) using HTML5 APIs, WebAssembly, and JavaScript. <strong>We do not upload, collect, store, or inspect your documents, images, or input text on any server.</strong>
        </p>

        <h2>2. Log Files</h2>
        <p>
          ToolNest follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>

        <h2>3. Google DoubleClick DART Cookie & Third-Party Advertising</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.onlinetoolnest.tech and other sites on the internet.
        </p>
        <ul>
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites.</li>
          <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
        </ul>

        <h2>4. Advertising Partners Privacy Policies</h2>
        <p>
          You may consult this list to find the Privacy Policy for each of the advertising partners of ToolNest. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ToolNest, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>

        <h2>5. Third Party Privacy Policies</h2>
        <p>
          ToolNest&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>

        <h2>6. Children&apos;s Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. ToolNest does not knowingly collect any Personal Identifiable Information from children under the age of 13.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:hello@onlinetoolnest.tech">hello@onlinetoolnest.tech</a>.
        </p>
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="page-wrap legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ About ToolNest</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">ABOUT TOOLNEST</div>
        <h1>Fast, Private & Essential Online Utilities</h1>
        <p>
          ToolNest is an independent digital toolbox providing high-performance browser utilities and verified Pakistan telecom guides with privacy at its core.
        </p>
      </div>

      <div className="article-content">
        <h2>Our Mission</h2>
        <p>
          In a world crowded with online converters that require paid subscriptions, impose daily quotas, or mandate email sign-ups, ToolNest was built to offer a clean, fast, and free alternative. Every tool on our platform is designed to fulfill everyday tasks—converting PDF to PowerPoint, compressing images, calculating financial parameters, or checking SIM balances—without friction or privacy risks.
        </p>

        <h2>Client-Side Browser Privacy Architecture</h2>
        <p>
          We believe your private documents and data should stay private. That is why ToolNest tools process data client-side inside your browser engine using modern JavaScript and WebAssembly standards.
        </p>

        <div className="seo-features-grid" style={{ margin: '32px 0' }}>
          <div className="seo-feature-card">
            <Shield size={28} className="text-emerald" />
            <h3>Zero Cloud Uploads</h3>
            <p>Your PDFs, photos, and formatted JSON strings are processed locally in your RAM. Nothing is sent to our servers.</p>
          </div>
          <div className="seo-feature-card">
            <Globe size={28} className="text-emerald" />
            <h3>Universal Compatibility</h3>
            <p>Runs seamlessly on Windows, macOS, Linux, iOS, and Android across Google Chrome, Safari, Firefox, and Edge.</p>
          </div>
          <div className="seo-feature-card">
            <CheckCircle size={28} className="text-emerald" />
            <h3>100% Free Forever</h3>
            <p>No subscriptions, no hidden limits, no mandatory account registration, and no paywalls.</p>
          </div>
        </div>

        <h2>Pakistan Utility & Telecom Guides</h2>
        <p>
          In addition to web utilities, ToolNest maintains verified, easy-to-read guides for checking mobile account balances, internet MBs, SIM numbers, USSD codes, and package information across Pakistan&apos;s major telecom providers: Telenor, Jazz, Zong, and Ufone.
        </p>

        <h2>Contact & Feedback</h2>
        <p>
          Have questions or suggestions for a new tool? Feel free to reach out to us at <a href="mailto:hello@onlinetoolnest.tech">hello@onlinetoolnest.tech</a> or visit our <Link to="/contact">Contact Page</Link>.
        </p>
      </div>
    </div>
  )
}

export function TermsPage() {
  return (
    <div className="page-wrap legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Terms of Service</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">TERMS OF USE</div>
        <h1>Terms of Service</h1>
        <p>
          By accessing or using ToolNest at https://www.onlinetoolnest.tech, you agree to be bound by these Terms of Service.
        </p>
      </div>

      <div className="article-content">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using our website, you signify your acceptance of these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2>2. Permitted Use</h2>
        <p>
          ToolNest provides free online software tools for personal, educational, and commercial productivity. You agree to use the website only for lawful purposes and in a manner that does not infringe upon the rights of others.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          The software code, layout, graphics, text, and branding on ToolNest are protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any portion of the site without explicit permission.
        </p>

        <h2>4. Disclaimer of Warranties</h2>
        <p>
          The tools and information on ToolNest are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind, whether express or implied.
        </p>
      </div>
    </div>
  )
}

export function DisclaimerPage() {
  return (
    <div className="page-wrap legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Disclaimer</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">LEGAL DISCLAIMER</div>
        <h1>Disclaimer</h1>
        <p>
          Information and tools on ToolNest are provided for general informational and productivity purposes.
        </p>
      </div>

      <div className="article-content">
        <h2>1. Telecom Information Disclaimer</h2>
        <p>
          ToolNest is an independent website and is <strong>not affiliated, associated, authorized, endorsed by, or in any way officially connected with Telenor Pakistan, Jazz (Mobilink), Zong (CMPak), or Ufone (PTML)</strong>. All product and company names, logos, and trademarks are the property of their respective holders.
        </p>

        <h2>2. Accuracy of Information</h2>
        <p>
          While we make every effort to ensure USSD codes, package details, and telecom guides are accurate and up-to-date, telecom operators frequently update codes, tax rates, and package terms. Please verify final terms with your provider&apos;s official app or customer helpline.
        </p>

        <h2>3. Tool Output Disclaimer</h2>
        <p>
          Calculators, converters, and formatters are provided for convenience. Users should verify critical calculations (such as financial loans or tax estimates) prior to executing transactions.
        </p>
      </div>
    </div>
  )
}

export function SitemapPage() {
  return (
    <div className="page-wrap legal-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/ Sitemap</span>
      </nav>

      <div className="page-intro">
        <div className="eyebrow">SITE OVERVIEW</div>
        <h1>ToolNest HTML Sitemap</h1>
        <p>
          Explore all online tools, converter utilities, calculator tools, developer tools, and Pakistan telecom guides.
        </p>
      </div>

      <div className="sitemap-sections">
        <div className="sitemap-card">
          <h2><FileText size={20} className="text-emerald" /> Featured & Core Pages</h2>
          <div className="sitemap-links-grid">
            <Link to="/">Home</Link>
            <Link to="/popular">Popular Tools</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>

        <div className="sitemap-card">
          <h2><Globe size={20} className="text-emerald" /> Tool Categories ({categories.length})</h2>
          <div className="sitemap-links-grid">
            {categories.map((c) => (
              <Link to={c.slug === 'pakistan' ? '/pakistan' : `/category/${c.slug}`} key={c.slug}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="sitemap-card">
          <h2><HelpCircle size={20} className="text-emerald" /> Free Online Tools ({tools.length})</h2>
          <div className="sitemap-links-grid">
            {tools.map((t) => (
              <Link to={`/tools/${t.slug}`} key={t.slug}>
                {t.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="sitemap-card">
          <h2><Smartphone size={20} className="text-emerald" /> Pakistan Telecom Guides</h2>
          <div className="sitemap-links-grid">
            <Link to="/pakistan" style={{ fontWeight: 600 }}>All Pakistan Guides</Link>
            <Link to="/pakistan/telenor/quiz-today" style={{ fontWeight: 600 }}>My Telenor Quiz Today</Link>
            {PROVIDERS.flatMap((p) =>
              GUIDE_TYPES.map((g) => (
                <Link to={`/pakistan/${p.slug}/${g.slug}`} key={`${p.slug}-${g.slug}`}>
                  {p.name} {g.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
