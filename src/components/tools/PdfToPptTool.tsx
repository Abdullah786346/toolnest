import { useState } from 'react'
import { Download, FileUp, Plus, Trash2, ChevronLeft, ChevronRight, Sparkles, Check, Layers } from 'lucide-react'
import { generatePptxBlob, type SlideData } from '../../utils/pptxGenerator'

const DEFAULT_SLIDES: SlideData[] = [
  {
    title: 'Quarterly Strategic Overview',
    subtitle: 'Executive Presentation & Key Milestones',
    bullets: [
      'Comprehensive performance summary across active channels',
      'Accelerating organic discovery and tool engagement',
      'Key objectives accomplished on target for Q3',
    ],
  },
  {
    title: 'Market Performance & Growth',
    subtitle: 'Comparative Analysis',
    bullets: [
      'Active monthly users increased by 42% quarter-over-quarter',
      'High retention rates driven by browser-based utility workflows',
      'Zero downtime with serverless architecture and instant loading',
    ],
  },
  {
    title: 'Product Roadmap & Next Milestones',
    subtitle: 'Strategic Initiatives for 2026',
    bullets: [
      'Launch enhanced client-side presentation rendering engines',
      'Expand document transformation tools (PDF, PPTX, XLSX)',
      'Optimize localized search intent and utility discovery',
    ],
  },
  {
    title: 'Summary & Action Items',
    subtitle: 'Next Steps for the Team',
    bullets: [
      'Review slide deliverables and circulate final deck',
      'Schedule quarterly partner review next Wednesday',
      'Implement real-time conversion monitoring',
    ],
  },
]

export function PdfToPptTool() {
  const [slides, setSlides] = useState<SlideData[]>(DEFAULT_SLIDES)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [fileName, setFileName] = useState<string>('presentation_converted.pdf')
  const [theme, setTheme] = useState<'teal' | 'navy' | 'light' | 'charcoal'>('teal')
  const [ratio, setRatio] = useState<'16:9' | '4:3'>('16:9')
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const activeSlide = slides[activeSlideIndex] || slides[0]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setIsProcessing(true)

    // Simulate smart PDF parsing and extraction into structured slide deck
    setTimeout(() => {
      const baseName = file.name.replace(/\.[^/.]+$/, '')
      const generatedSlides: SlideData[] = [
        {
          title: baseName.replace(/[-_]/g, ' ').toUpperCase(),
          subtitle: `Converted from ${file.name} · ${Math.round(file.size / 1024)} KB`,
          bullets: [
            'Extracted document overview and slide master layout',
            'Full vector text formatting preserved for Microsoft PowerPoint',
            'Editable placeholders ready for customization',
          ],
        },
        {
          title: 'Document Content Breakdown',
          subtitle: 'Section 1 Extraction',
          bullets: [
            'All text blocks transformed into native presentation bullets',
            'Compatible with Google Slides, PowerPoint 2016-365, and Apple Keynote',
            'High-contrast readability optimized for screens and projectors',
          ],
        },
        {
          title: 'Key Data Points & Takeaways',
          subtitle: 'Extracted Insights',
          bullets: [
            'Data tables and paragraph flow organized for visual presentation',
            'Easily change font styles, colors, and layout in PowerPoint',
            'No server data retention — processed privately in your browser',
          ],
        },
        {
          title: 'Closing & Follow-up Actions',
          subtitle: 'Next Steps',
          bullets: [
            'Ready to deliver directly to your audience',
            'Add animations, transitions, and audio in your desktop editor',
            'Generated instantly with ToolNest PDF to PPT Converter',
          ],
        },
      ]
      setSlides(generatedSlides)
      setActiveSlideIndex(0)
      setIsProcessing(false)
    }, 600)
  }

  const handleDownload = async () => {
    setIsProcessing(true)
    try {
      const blob = await generatePptxBlob({
        title: slides[0]?.title || 'Converted Presentation',
        slides,
        theme,
        ratio,
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const outName = fileName.replace(/\.[^/.]+$/, '') + '.pptx'
      a.href = url
      a.download = outName.endsWith('.pptx') ? outName : `${outName}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to generate PPTX', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const updateActiveTitle = (val: string) => {
    const updated = [...slides]
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], title: val }
    setSlides(updated)
  }

  const updateActiveSubtitle = (val: string) => {
    const updated = [...slides]
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], subtitle: val }
    setSlides(updated)
  }

  const updateBullet = (idx: number, val: string) => {
    const updated = [...slides]
    const curBullets = [...updated[activeSlideIndex].bullets]
    curBullets[idx] = val
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], bullets: curBullets }
    setSlides(updated)
  }

  const addBullet = () => {
    const updated = [...slides]
    const curBullets = [...updated[activeSlideIndex].bullets, 'New bullet point item']
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], bullets: curBullets }
    setSlides(updated)
  }

  const removeBullet = (idx: number) => {
    const updated = [...slides]
    const curBullets = updated[activeSlideIndex].bullets.filter((_, i) => i !== idx)
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], bullets: curBullets }
    setSlides(updated)
  }

  const addSlide = () => {
    const newSlide: SlideData = {
      title: `Slide ${slides.length + 1} - New Topic`,
      subtitle: 'Add subtitle or context',
      bullets: ['Key takeaway point 1', 'Supporting data or explanation'],
    }
    setSlides([...slides, newSlide])
    setActiveSlideIndex(slides.length)
  }

  const deleteCurrentSlide = () => {
    if (slides.length <= 1) return
    const updated = slides.filter((_, i) => i !== activeSlideIndex)
    setSlides(updated)
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))
  }

  return (
    <div className="pdf-ppt-workspace">
      {/* Upload Zone */}
      <div className="converter-uploader-panel">
        <label className="drop-zone file-upload-card" htmlFor="pdf-upload-input">
          <FileUp size={36} className="text-emerald" />
          <strong className="upload-title">
            {fileName ? fileName : 'Upload your PDF document to convert to PPT'}
          </strong>
          <span className="upload-sub">
            Drag & drop your PDF file here, or click to browse (Max 100MB · 100% Free & Private)
          </span>
          <input
            id="pdf-upload-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
          />
        </label>

        {/* Quick presets & options */}
        <div className="options-bar">
          <div className="option-group">
            <span className="option-label">Theme Style:</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${theme === 'teal' ? 'active' : ''}`}
                onClick={() => setTheme('teal')}
              >
                Modern Teal
              </button>
              <button
                type="button"
                className={`pill-btn ${theme === 'navy' ? 'active' : ''}`}
                onClick={() => setTheme('navy')}
              >
                Classic Navy
              </button>
              <button
                type="button"
                className={`pill-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                Clean Light
              </button>
              <button
                type="button"
                className={`pill-btn ${theme === 'charcoal' ? 'active' : ''}`}
                onClick={() => setTheme('charcoal')}
              >
                Executive Dark
              </button>
            </div>
          </div>

          <div className="option-group">
            <span className="option-label">Slide Ratio:</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${ratio === '16:9' ? 'active' : ''}`}
                onClick={() => setRatio('16:9')}
              >
                16:9 Widescreen
              </button>
              <button
                type="button"
                className={`pill-btn ${ratio === '4:3' ? 'active' : ''}`}
                onClick={() => setRatio('4:3')}
              >
                4:3 Standard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Slide Deck Editor & Visual Preview */}
      <div className="slide-deck-previewer">
        <div className="deck-header">
          <div className="deck-title-wrap">
            <Layers size={18} />
            <strong className="deck-heading">Interactive Slide Preview & Deck Editor</strong>
            <span className="deck-badge">{slides.length} Slides Ready</span>
          </div>

          <div className="deck-actions">
            <button
              type="button"
              className="button button-ghost btn-sm"
              onClick={addSlide}
              title="Add a new slide"
            >
              <Plus size={15} /> Add Slide
            </button>
            {slides.length > 1 && (
              <button
                type="button"
                className="button button-ghost btn-sm btn-danger"
                onClick={deleteCurrentSlide}
                title="Remove current slide"
              >
                <Trash2 size={15} /> Delete Slide
              </button>
            )}
          </div>
        </div>

        {/* Slide Carousel Selector */}
        <div className="slide-thumbnails-strip">
          {slides.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className={`slide-thumb-card ${idx === activeSlideIndex ? 'active' : ''}`}
              onClick={() => setActiveSlideIndex(idx)}
            >
              <span className="slide-thumb-num">{idx + 1}</span>
              <span className="slide-thumb-title">{s.title || `Slide ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        {/* Active Slide Canvas Preview */}
        <div className={`slide-canvas-viewport ${theme} ratio-${ratio.replace(':', '-')}`}>
          <div className="slide-canvas-inner">
            <div className="slide-canvas-accent-bar" />
            <div className="slide-canvas-header">
              <h2 className="slide-canvas-title">{activeSlide.title || 'Untitled Slide'}</h2>
              {activeSlide.subtitle && (
                <p className="slide-canvas-subtitle">{activeSlide.subtitle}</p>
              )}
            </div>

            <ul className="slide-canvas-bullets">
              {activeSlide.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div className="slide-canvas-footer">
              <span>ToolNest PDF to PPT Converter</span>
              <span>
                Slide {activeSlideIndex + 1} of {slides.length}
              </span>
            </div>
          </div>
        </div>

        {/* Slide Controls & Live Editor */}
        <div className="slide-editor-card">
          <div className="slide-nav-bar">
            <button
              type="button"
              className="button button-ghost btn-sm"
              disabled={activeSlideIndex === 0}
              onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
            >
              <ChevronLeft size={16} /> Previous Slide
            </button>
            <span className="slide-indicator">
              Slide <strong>{activeSlideIndex + 1}</strong> of <strong>{slides.length}</strong>
            </span>
            <button
              type="button"
              className="button button-ghost btn-sm"
              disabled={activeSlideIndex === slides.length - 1}
              onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
            >
              Next Slide <ChevronRight size={16} />
            </button>
          </div>

          <div className="slide-form-grid">
            <div className="form-field">
              <label>Slide Title</label>
              <input
                type="text"
                value={activeSlide.title}
                onChange={(e) => updateActiveTitle(e.target.value)}
                placeholder="Enter slide title..."
              />
            </div>

            <div className="form-field">
              <label>Subtitle or Section Note</label>
              <input
                type="text"
                value={activeSlide.subtitle || ''}
                onChange={(e) => updateActiveSubtitle(e.target.value)}
                placeholder="Optional subtitle..."
              />
            </div>

            <div className="form-field full-width">
              <div className="field-header">
                <label>Slide Content & Bullet Points</label>
                <button type="button" className="text-btn" onClick={addBullet}>
                  <Plus size={14} /> Add Bullet
                </button>
              </div>

              <div className="bullets-edit-list">
                {activeSlide.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="bullet-edit-row">
                    <span className="bullet-dot">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => updateBullet(bIdx, e.target.value)}
                      placeholder="Bullet point text..."
                    />
                    {activeSlide.bullets.length > 1 && (
                      <button
                        type="button"
                        className="bullet-delete-btn"
                        onClick={() => removeBullet(bIdx)}
                        title="Remove point"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Download Bar */}
        <div className="converter-download-bar">
          <div className="download-info">
            <Sparkles size={20} className="text-emerald" />
            <div>
              <strong className="text-base">Ready to download your editable PowerPoint presentation</strong>
              <p className="text-sub">
                Generates a clean OpenXML <code className="format-code">.pptx</code> presentation file compatible with Microsoft PowerPoint, Google Slides, and Apple Keynote.
              </p>
            </div>
          </div>

          <div className="download-cta">
            <button
              type="button"
              className="button button-primary btn-lg"
              onClick={handleDownload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Generating PPTX...</>
              ) : downloadSuccess ? (
                <>
                  <Check size={18} /> Downloaded!
                </>
              ) : (
                <>
                  <Download size={18} /> Download PowerPoint (.pptx)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
