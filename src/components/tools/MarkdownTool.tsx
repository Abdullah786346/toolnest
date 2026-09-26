import { useState } from 'react'
import { Copy, Eye, Code, Download } from 'lucide-react'
import { useToast } from '../common/Toast'

export function MarkdownTool() {
  const [markdown, setMarkdown] = useState(`# Welcome to ToolNest Markdown Editor

## Features
- **Live Markdown Preview**
- *Instant HTML rendering*
- Clean syntax support
- Copy HTML or Markdown in 1 click

> "Simplicity is prerequisite for reliability." – Edsger W. Dijkstra

### Code Example
\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('ToolNest User'));
\`\`\`

- [x] Create document
- [ ] Share with team
- [ ] Export HTML
`)
  const [tab, setTab] = useState<'preview' | 'html'>('preview')
  const { showToast } = useToast()

  const convertMarkdownToHtml = (src: string) => {
    return src
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' rel='noreferrer'>$1</a>")
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^\s*\n\*/g, '<ul>\n*')
      .replace(/^-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br /><br />')
  }

  const htmlOutput = convertMarkdownToHtml(markdown)

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlOutput)
    showToast('HTML copied to clipboard!', '', 'success')
  }

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown)
    showToast('Markdown text copied to clipboard!', '', 'success')
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`Downloaded ${filename}!`, '', 'success')
  }

  const stats = {
    words: markdown.trim() ? markdown.trim().split(/\s+/).length : 0,
    chars: markdown.length,
    lines: markdown.split('\n').length,
  }

  return (
    <div className="dev-tool-container">
      <div className="dev-action-toolbar">
        <div className="pill-group">
          <button
            type="button"
            className={`pill-btn ${tab === 'preview' ? 'active' : ''}`}
            onClick={() => setTab('preview')}
          >
            <Eye size={14} /> Visual Preview
          </button>
          <button
            type="button"
            className={`pill-btn ${tab === 'html' ? 'active' : ''}`}
            onClick={() => setTab('html')}
          >
            <Code size={14} /> Raw HTML
          </button>
        </div>

        <div className="action-buttons-right">
          <button type="button" className="button button-ghost btn-sm" onClick={copyMarkdown}>
            <Copy size={14} /> Copy MD
          </button>
          <button type="button" className="button button-ghost btn-sm" onClick={copyHtml}>
            <Copy size={14} /> Copy HTML
          </button>
          <button
            type="button"
            className="button button-primary btn-sm"
            onClick={() => downloadFile(markdown, 'document.md', 'text/markdown')}
          >
            <Download size={14} /> Download .md
          </button>
        </div>
      </div>

      <div className="stats-inline-banner">
        <span>Words: <strong>{stats.words}</strong></span>
        <span>Characters: <strong>{stats.chars}</strong></span>
        <span>Lines: <strong>{stats.lines}</strong></span>
      </div>

      <div className="dev-editors-split">
        <div className="editor-pane">
          <span className="pane-header">Markdown Input:</span>
          <textarea
            className="code-textarea"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
          />
        </div>

        <div className="editor-pane">
          <span className="pane-header">
            {tab === 'preview' ? 'Live HTML Preview:' : 'Generated HTML Code:'}
          </span>
          {tab === 'preview' ? (
            <div
              className="markdown-preview-box"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          ) : (
            <textarea
              className="code-textarea output"
              value={htmlOutput}
              readOnly
              placeholder="HTML output will render here..."
            />
          )}
        </div>
      </div>
    </div>
  )
}
