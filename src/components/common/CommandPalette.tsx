import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft, Sparkles, X, Smartphone } from 'lucide-react'
import { tools, categories } from '../../data'
import { PROVIDERS, GUIDE_TYPES } from '../../data/pakistanGuidesData'

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const filteredTools = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : tools.filter((t) => t.popular).slice(0, 5)

  const filteredCategories = query.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const filteredGuides = query.trim()
    ? PROVIDERS.flatMap((p) =>
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
          g.title.toLowerCase().includes(query.toLowerCase()) ||
          g.provider.toLowerCase().includes(query.toLowerCase()) ||
          g.guideName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  const totalResults = filteredTools.length + filteredCategories.length + filteredGuides.length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (totalResults > 0 ? (prev + 1) % totalResults : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (totalResults > 0 ? (prev - 1 + totalResults) % totalResults : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (totalResults > 0) {
          if (selectedIndex < filteredTools.length) {
            const selected = filteredTools[selectedIndex]
            navigate(`/tools/${selected.slug}`)
          } else if (selectedIndex < filteredTools.length + filteredCategories.length) {
            const cat = filteredCategories[selectedIndex - filteredTools.length]
            navigate(cat.slug === 'pakistan' ? '/pakistan' : `/category/${cat.slug}`)
          } else {
            const guide = filteredGuides[selectedIndex - filteredTools.length - filteredCategories.length]
            navigate(`/pakistan/${guide.providerSlug}/${guide.guideSlug}`)
          }
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, totalResults, filteredTools, filteredCategories, filteredGuides, navigate, onClose])

  if (!isOpen) return null

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-search-header">
          <Search size={20} className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search 30+ tools, converters, calculators, Pakistan guides..."
            aria-label="Search command palette"
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <span className="kbd-badge">ESC to exit</span>
        </div>

        <div className="command-results-body">
          {filteredCategories.length > 0 && (
            <div className="command-section">
              <div className="section-label">Categories</div>
              {filteredCategories.map((cat, idx) => {
                const itemIndex = filteredTools.length + idx
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.slug}
                    to={cat.slug === 'pakistan' ? '/pakistan' : `/category/${cat.slug}`}
                    onClick={onClose}
                    className={`command-item ${itemIndex === selectedIndex ? 'selected' : ''}`}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                  >
                    <div className="command-icon cat-icon">
                      <Icon size={16} />
                    </div>
                    <div className="command-text">
                      <strong>{cat.name}</strong>
                      <small>{cat.count} tools available</small>
                    </div>
                    {itemIndex === selectedIndex && (
                      <span className="enter-badge">
                        Select <CornerDownLeft size={12} />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}

          {filteredGuides.length > 0 && (
            <div className="command-section">
              <div className="section-label">Pakistan Telecom Guides</div>
              {filteredGuides.map((guide, idx) => {
                const itemIndex = filteredTools.length + filteredCategories.length + idx
                return (
                  <Link
                    key={`${guide.providerSlug}-${guide.guideSlug}`}
                    to={`/pakistan/${guide.providerSlug}/${guide.guideSlug}`}
                    onClick={onClose}
                    className={`command-item ${itemIndex === selectedIndex ? 'selected' : ''}`}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                  >
                    <div className="command-icon" style={{ background: `${guide.color}15`, color: guide.color }}>
                      <Smartphone size={16} />
                    </div>
                    <div className="command-text">
                      <strong>{guide.title}</strong>
                      <small>Official USSD code & instructions</small>
                    </div>
                    <span className="cat-pill">Pakistan</span>
                    {itemIndex === selectedIndex && (
                      <span className="enter-badge">
                        Open <CornerDownLeft size={12} />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}

          <div className="command-section">
            <div className="section-label">
              {query.trim() ? 'Tools & Utilities' : 'Popular Tools'}
            </div>
            {filteredTools.length > 0 ? (
              filteredTools.map((t, idx) => {
                const Icon = t.icon
                const isSelected = idx === selectedIndex
                return (
                  <Link
                    key={t.slug}
                    to={`/tools/${t.slug}`}
                    onClick={onClose}
                    className={`command-item ${isSelected ? 'selected' : ''}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="command-icon">
                      <Icon size={16} />
                    </div>
                    <div className="command-text">
                      <strong>{t.name}</strong>
                      <small>{t.description}</small>
                    </div>
                    <span className="cat-pill">{t.category}</span>
                    {isSelected && (
                      <span className="enter-badge">
                        Open <CornerDownLeft size={12} />
                      </span>
                    )}
                  </Link>
                )
              })
            ) : totalResults === 0 ? (
              <div className="no-results">
                <Sparkles size={24} />
                <p>No tools found matching &quot;{query}&quot;</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="command-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to select
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  )
}
