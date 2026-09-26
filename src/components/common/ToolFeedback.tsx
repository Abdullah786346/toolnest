import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Bookmark, Share2 } from 'lucide-react'
import { useToast } from './Toast'

export function ToolFeedback({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('toolnest-bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(toolSlug))
    const userVote = localStorage.getItem(`toolnest-vote-${toolSlug}`)
    if (userVote === 'up' || userVote === 'down') setVoted(userVote)
  }, [toolSlug])

  const toggleBookmark = () => {
    const bookmarks: string[] = JSON.parse(localStorage.getItem('toolnest-bookmarks') || '[]')
    let next: string[]
    if (bookmarks.includes(toolSlug)) {
      next = bookmarks.filter((b) => b !== toolSlug)
      setIsBookmarked(false)
      showToast(`Removed ${toolName} from bookmarks`, '', 'info')
    } else {
      next = [...bookmarks, toolSlug]
      setIsBookmarked(true)
      showToast(`Saved ${toolName} to bookmarks!`, '', 'success')
    }
    localStorage.setItem('toolnest-bookmarks', JSON.stringify(next))
  }

  const handleVote = (type: 'up' | 'down') => {
    setVoted(type)
    localStorage.setItem(`toolnest-vote-${toolSlug}`, type)
    showToast(type === 'up' ? 'Thanks for your positive feedback!' : 'Thanks for your feedback!', '', 'success')
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${toolName} | ToolNest`, url })
      } catch {
        // ignore fallback
      }
    } else {
      await navigator.clipboard.writeText(url)
      showToast('Tool URL copied to clipboard!', '', 'success')
    }
  }

  return (
    <div className="tool-feedback-bar">
      <div className="feedback-group">
        <span className="feedback-label">Was this tool helpful?</span>
        <button
          type="button"
          className={`vote-btn ${voted === 'up' ? 'active-up' : ''}`}
          onClick={() => handleVote('up')}
          aria-label="Thumbs up"
        >
          <ThumbsUp size={15} /> Yes
        </button>
        <button
          type="button"
          className={`vote-btn ${voted === 'down' ? 'active-down' : ''}`}
          onClick={() => handleVote('down')}
          aria-label="Thumbs down"
        >
          <ThumbsDown size={15} /> No
        </button>
      </div>

      <div className="feedback-actions">
        <button
          type="button"
          className={`utility-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={toggleBookmark}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this tool'}
        >
          <Bookmark size={15} />
          <span>{isBookmarked ? 'Saved' : 'Save Tool'}</span>
        </button>

        <button type="button" className="utility-action-btn" onClick={handleShare} title="Share tool">
          <Share2 size={15} />
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}
