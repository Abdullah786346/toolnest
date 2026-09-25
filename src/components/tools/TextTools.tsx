import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

export function WordCounterTool() {
  const [text, setText] = useState('ToolNest provides free, fast, and secure online tools for everyday work. Convert PDF documents, format code, compress images, and run calculators with total privacy.')
  const [copied, setCopied] = useState(false)

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0
  const readingTimeMin = (words / 200).toFixed(1)
  const speakingTimeMin = (words / 130).toFixed(1)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="text-tool-container">
      <div className="stats-badges-strip">
        <div className="stat-pill">
          <span className="lbl">Words</span>
          <strong className="val text-emerald">{words}</strong>
        </div>
        <div className="stat-pill">
          <span className="lbl">Characters</span>
          <strong className="val">{characters}</strong>
        </div>
        <div className="stat-pill">
          <span className="lbl">Without Spaces</span>
          <strong className="val">{charactersNoSpaces}</strong>
        </div>
        <div className="stat-pill">
          <span className="lbl">Sentences</span>
          <strong className="val">{sentences}</strong>
        </div>
        <div className="stat-pill">
          <span className="lbl">Paragraphs</span>
          <strong className="val">{paragraphs}</strong>
        </div>
        <div className="stat-pill">
          <span className="lbl">Reading Time</span>
          <strong className="val text-lime">~{readingTimeMin} min</strong>
        </div>
        <div className="stat-pill">
          <span className="lbl">Speaking Time</span>
          <strong className="val">~{speakingTimeMin} min</strong>
        </div>
      </div>

      <div className="form-field">
        <div className="field-header">
          <label>Type or Paste Text Below:</label>
          <div className="btn-group-sm">
            <button type="button" className="text-btn" onClick={() => setText('')}>
              Clear
            </button>
            <button type="button" className="text-btn" onClick={copy}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <textarea
          className="code-textarea text-input-area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here..."
        />
      </div>
    </div>
  )
}

export function CaseConverterTool() {
  const [text, setText] = useState('Transform your text instantly into any casing format.')
  const [copied, setCopied] = useState(false)

  const toUpper = () => setText(text.toUpperCase())
  const toLower = () => setText(text.toLowerCase())
  const toTitle = () => {
    setText(
      text
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    )
  }
  const toSentence = () => {
    setText(
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    )
  }
  const toCamel = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    )
  }
  const toKebab = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    )
  }
  const toSnake = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '')
    )
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="text-tool-container">
      <div className="case-buttons-row">
        <button type="button" className="pill-btn" onClick={toUpper}>
          UPPERCASE
        </button>
        <button type="button" className="pill-btn" onClick={toLower}>
          lowercase
        </button>
        <button type="button" className="pill-btn" onClick={toTitle}>
          Title Case
        </button>
        <button type="button" className="pill-btn" onClick={toSentence}>
          Sentence case
        </button>
        <button type="button" className="pill-btn" onClick={toCamel}>
          camelCase
        </button>
        <button type="button" className="pill-btn" onClick={toKebab}>
          kebab-case
        </button>
        <button type="button" className="pill-btn" onClick={toSnake}>
          snake_case
        </button>
      </div>

      <div className="form-field">
        <div className="field-header">
          <label>Text Content:</label>
          <button type="button" className="text-btn" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <textarea
          className="code-textarea text-input-area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
        />
      </div>
    </div>
  )
}

export function RemoveDuplicatesTool() {
  const [text, setText] = useState('Apple\nBanana\nOrange\nApple\nMango\nBanana')
  const [trimLines, setTrimLines] = useState(true)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [stats, setStats] = useState<string | null>(null)

  const process = () => {
    const rawLines = text.split(/\r?\n/)
    const seen = new Set<string>()
    const result: string[] = []

    for (let line of rawLines) {
      if (trimLines) line = line.trim()
      const key = caseSensitive ? line : line.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        result.push(line)
      }
    }

    const removed = rawLines.length - result.length
    setText(result.join('\n'))
    setStats(`Cleaned! Removed ${removed} duplicate line(s).`)
  }

  return (
    <div className="text-tool-container">
      <div className="options-bar">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
          />
          <span>Trim Whitespace</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          <span>Case Sensitive</span>
        </label>
        <button type="button" className="button button-primary btn-sm ml-auto" onClick={process}>
          Remove Duplicates
        </button>
      </div>

      {stats && <div className="info-banner-mini">{stats}</div>}

      <textarea
        className="code-textarea text-input-area"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setStats(null)
        }}
        placeholder="Paste lines of text..."
      />
    </div>
  )
}

export function TextSorterTool() {
  const [text, setText] = useState('Zebra\nAlpha\nCharlie\nBeta\nDelta')

  const sortAZ = () => {
    const sorted = text.split(/\r?\n/).sort((a, b) => a.localeCompare(b))
    setText(sorted.join('\n'))
  }
  const sortZA = () => {
    const sorted = text.split(/\r?\n/).sort((a, b) => b.localeCompare(a))
    setText(sorted.join('\n'))
  }
  const sortByLength = () => {
    const sorted = text.split(/\r?\n/).sort((a, b) => a.length - b.length)
    setText(sorted.join('\n'))
  }
  const reverse = () => {
    const rev = text.split(/\r?\n/).reverse()
    setText(rev.join('\n'))
  }
  const shuffle = () => {
    const arr = text.split(/\r?\n/)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setText(arr.join('\n'))
  }

  return (
    <div className="text-tool-container">
      <div className="case-buttons-row">
        <button type="button" className="pill-btn" onClick={sortAZ}>
          Sort A → Z
        </button>
        <button type="button" className="pill-btn" onClick={sortZA}>
          Sort Z → A
        </button>
        <button type="button" className="pill-btn" onClick={sortByLength}>
          Sort by Length
        </button>
        <button type="button" className="pill-btn" onClick={reverse}>
          Reverse Lines
        </button>
        <button type="button" className="pill-btn" onClick={shuffle}>
          Shuffle Lines
        </button>
      </div>

      <textarea
        className="code-textarea text-input-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter lines to sort..."
      />
    </div>
  )
}

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState(
    'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  )
  const [copied, setCopied] = useState(false)

  const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
    'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
    'duis', 'aute', 'irure', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse',
    'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
    'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ]

  const generate = () => {
    const paras: string[] = []
    for (let p = 0; p < paragraphs; p++) {
      const sentenceCount = 4 + Math.floor(Math.random() * 3)
      const sentences: string[] = []
      for (let s = 0; s < sentenceCount; s++) {
        const wordCount = 8 + Math.floor(Math.random() * 10)
        const words: string[] = []
        for (let w = 0; w < wordCount; w++) {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)])
        }
        let sentenceStr = words.join(' ')
        if (p === 0 && s === 0 && startWithLorem) {
          sentenceStr = 'lorem ipsum dolor sit amet ' + sentenceStr
        }
        sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + '.'
        sentences.push(sentenceStr)
      }
      paras.push(sentences.join(' '))
    }
    setOutput(paras.join('\n\n'))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="text-tool-container">
      <div className="options-bar">
        <div className="option-group">
          <span className="option-label">Paragraphs: <strong>{paragraphs}</strong></span>
          <input
            type="range"
            min={1}
            max={10}
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            className="range-slider max-w-xs"
          />
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
          />
          <span>Start with &quot;Lorem ipsum...&quot;</span>
        </label>
        <button type="button" className="button button-primary btn-sm ml-auto" onClick={generate}>
          <RefreshCw size={14} /> Generate
        </button>
      </div>

      <div className="form-field">
        <div className="field-header">
          <label>Generated Copy:</label>
          <button type="button" className="text-btn" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Text'}
          </button>
        </div>
        <textarea
          className="code-textarea text-input-area"
          value={output}
          readOnly
        />
      </div>
    </div>
  )
}
