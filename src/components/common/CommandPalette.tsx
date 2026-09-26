import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft, Sparkles, X } from 'lucide-react'
import { tools, categories } from '../../data'

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
    : tools.filter((t) => t.popular).slice(0, 6)

  const filteredCategories = query.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const totalResults = filteredTools.length + filteredCategories.length

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
          } else {
            const cat = filteredCategories[selectedIndex - filteredTools.length]
            navigate(cat.slug === 'pakistan' ? '/pakistan' : `/category/${cat.slug}`)
          }
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, totalResults, filteredTools, filteredCategories, navigate, onClose])

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
            placeholder="Search tools, converters, calculators, guides..."
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
            ) : (
              <div className="no-results">
                <Sparkles size={24} />
                <p>No tools found matching &quot;{query}&quot;</p>
              </div>
            )}
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
