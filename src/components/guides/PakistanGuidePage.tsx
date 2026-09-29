import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Copy, Phone, ShieldCheck, Smartphone, HelpCircle } from 'lucide-react'
import { getGuideDetail, GUIDE_TYPES, PROVIDERS } from '../../data/pakistanGuidesData'
import { useToast } from '../common/Toast'

export function PakistanGuidePage({ providerSlug, guideSlug }: { providerSlug: string; guideSlug: string }) {
  const guide = getGuideDetail(providerSlug, guideSlug)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { showToast } = useToast()

  const providerObj = PROVIDERS.find((p) => p.slug === providerSlug) || PROVIDERS[0]

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    showToast(`Copied code ${code} to clipboard!`, '', 'success')
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <div className="page-wrap article-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/pakistan">Pakistan</Link>
        <span>/</span>
        <Link to={`/pakistan/${providerSlug}`}>{guide.provider}</Link>
        <span>/ {guide.guideType}</span>
      </nav>

      <header className="page-intro">
        <div className="eyebrow" style={{ color: providerObj.color, borderColor: `${providerObj.color}40`, background: `${providerObj.color}10` }}>
          OFFICIAL {guide.provider.toUpperCase()} TELECOM GUIDE
        </div>
        <h1>{guide.title}</h1>
        <p>{guide.summary}</p>
      </header>

      {/* Main USSD Code Highlight Box */}
      <div className="code-highlight-card" style={{ borderLeft: `5px solid ${providerObj.color}` }}>
        <div className="code-card-header">
          <div className="code-card-title">
            <Phone size={20} style={{ color: providerObj.color }} />
            <span>Official USSD Code</span>
          </div>
          <span className="verified-badge">
            <Check size={14} /> Verified 2026
          </span>
        </div>
        <div className="code-card-body">
          <div className="ussd-number">{guide.ussdCode}</div>
          <button
            type="button"
            className="button button-primary copy-ussd-btn"
            onClick={() => handleCopy(guide.ussdCode)}
          >
            {copiedCode === guide.ussdCode ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedCode === guide.ussdCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        {guide.smsCode && (
          <div className="code-card-sub">
            <strong>SMS Alternative:</strong> {guide.smsCode}
          </div>
        )}
      </div>

      <div className="article-content">
        <h2>How to check {guide.provider} {guide.guideType.toLowerCase()} step-by-step</h2>
        <div className="steps-list">
          {guide.quickSteps.map((step, index) => (
            <div className="step-card" key={step}>
              <div className="step-number" style={{ background: providerObj.color }}>{index + 1}</div>
              <div className="step-content">
                <p style={{ margin: 0, fontSize: '16px', color: 'var(--text)' }}>{step}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AdSlot */}
        <div className="ad-slot" style={{ margin: '32px 0' }}>
          <span>Advertisement</span>
        </div>

        <h2>{guide.provider} {guide.guideType} Quick Reference Table</h2>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Service Option</th>
                <th>Code / Action</th>
                <th>Details & Notes</th>
              </tr>
            </thead>
            <tbody>
              {guide.tableData.map((row) => (
                <tr key={row.option}>
                  <td><strong>{row.option}</strong></td>
                  <td>
                    <code className="ussd-code-tag">{row.code}</code>
                    {row.code.startsWith('*') && (
                      <button
                        type="button"
                        className="inline-copy-btn"
                        onClick={() => handleCopy(row.code)}
                        title="Copy code"
                      >
                        <Copy size={12} />
                      </button>
                    )}
                  </td>
                  <td>{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Check via Official {guide.officialApp}</h2>
        <div className="app-download-box">
          <Smartphone size={32} style={{ color: providerObj.color }} />
          <div>
            <h3>Use {guide.officialApp} for 100% Free Access</h3>
            <p>
              Download the official <strong>{guide.officialApp}</strong> on Android or iOS. Sign in with your {guide.provider} number to check real-time credit, remaining 4G data MBs, active packages, and recharge history without dialing USSD codes.
            </p>
          </div>
        </div>

        <div className="update-note">
          <ShieldCheck size={22} />
          <div>
            <strong>Verified Telecom Information</strong>
            <p>
              All USSD codes and steps are maintained for accuracy. Standard taxes and regulatory terms set by PTA (Pakistan Telecommunication Authority) apply. Helpline: Dial <strong>{guide.helpline}</strong> from your {guide.provider} SIM.
            </p>
          </div>
        </div>

        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {guide.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <HelpCircle size={18} style={{ color: providerObj.color, marginRight: '8px' }} />
                {faq.question}
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <h2>More {guide.provider} Utility Guides</h2>
        <div className="guide-links-grid">
          {GUIDE_TYPES.filter((g) => g.slug !== guideSlug).map((g) => (
            <Link to={`/pakistan/${providerSlug}/${g.slug}`} key={g.slug} className="guide-link-card">
              <span>{guide.provider} {g.name}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>

        <h2>Other Network Guides in Pakistan</h2>
        <div className="provider-badges-grid">
          {PROVIDERS.filter((p) => p.slug !== providerSlug).map((p) => (
            <Link to={`/pakistan/${p.slug}/${guideSlug}`} key={p.slug} className="provider-badge-link" style={{ borderColor: `${p.color}40` }}>
              <span className="badge-dot" style={{ background: p.color }} />
              <span>{p.name} {guide.guideType}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
