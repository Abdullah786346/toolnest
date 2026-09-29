import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import type { Tool } from '../../data'
import { getToolFaqs } from '../../data/toolFaqs'
import { tools } from '../../data'

export function ToolArticle({ tool }: { tool: Tool }) {
  const faqs = getToolFaqs(tool)
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4)

  return (
    <div className="article-content" style={{ marginTop: '36px' }}>
      <h2>How to Use {tool.name}</h2>
      <p>
        Using the <strong>{tool.name}</strong> on ToolNest is fast, private, and effortless. Simply enter your input in the workspace box above, adjust any settings to fit your needs, and receive your processed output instantly.
      </p>

      <div className="steps-list">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Provide Your Input</h3>
            <p>Upload your document, paste your text or code snippet, or select parameters in the tool workplace above.</p>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Configure Options</h3>
            <p>Select formatting presets, aspect ratios, compression levels, or custom parameters in real time.</p>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Copy or Download Results</h3>
            <p>Click to copy the processed output to your clipboard or download the generated file to your device with zero fees.</p>
          </div>
        </div>
      </div>

      <h2>Why Choose ToolNest {tool.name}?</h2>
      <div className="seo-features-grid">
        <div className="seo-feature-card">
          <ShieldCheck size={26} className="text-emerald" />
          <h3>100% Client-Side Privacy</h3>
          <p>
            Your documents and data are processed locally inside your web browser. No files are uploaded to cloud servers.
          </p>
        </div>

        <div className="seo-feature-card">
          <Zap size={26} className="text-emerald" />
          <h3>Instant & Unlimited Usage</h3>
          <p>
            Process as many files or inputs as you need. There are no hourly quotas, artificial waiting times, or paywalls.
          </p>
        </div>

        <div className="seo-feature-card">
          <CheckCircle2 size={26} className="text-emerald" />
          <h3>No Registration Required</h3>
          <p>
            Start working immediately without creating an account, providing an email address, or installing software extensions.
          </p>
        </div>
      </div>

      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>

      {relatedTools.length > 0 && (
        <>
          <h2>Related Tools in {tool.category}</h2>
          <div className="related-tools">
            {relatedTools.map((item) => (
              <Link to={`/tools/${item.slug}`} key={item.slug}>
                <span>{item.name}</span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
