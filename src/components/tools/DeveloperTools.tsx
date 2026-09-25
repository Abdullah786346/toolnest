import { useState } from 'react'
import { Copy, Check, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react'

export function JsonFormatterTool() {
  const [input, setInput] = useState('{\n  "name": "ToolNest",\n  "tools": 33,\n  "features": ["PDF", "PPT", "Images", "Calculators"],\n  "active": true\n}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = (indent: number | string) => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
    } catch (e: any) {
      setError(`JSON Parse Error: ${e.message}`)
    }
  }

  const minify = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch (e: any) {
      setError(`JSON Parse Error: ${e.message}`)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="dev-tool-container">
      <div className="dev-action-toolbar">
        <button type="button" className="button button-primary btn-sm" onClick={() => format(2)}>
          Format (2 Spaces)
        </button>
        <button type="button" className="button button-ghost btn-sm" onClick={() => format(4)}>
          Format (4 Spaces)
        </button>
        <button type="button" className="button button-ghost btn-sm" onClick={minify}>
          Minify / Compact
        </button>
        <button
          type="button"
          className="button button-ghost btn-sm"
          onClick={() => {
            setInput('{\n  "user": {\n    "id": 101,\n    "role": "admin",\n    "preferences": {\n      "theme": "dark",\n      "notifications": true\n    }\n  }\n}')
            setError('')
            setOutput('')
          }}
        >
          Load Sample
        </button>
        {(output || input) && (
          <button type="button" className="button button-ghost btn-sm ml-auto" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Output'}
          </button>
        )}
      </div>

      <div className="dev-editors-split">
        <div className="editor-pane">
          <span className="pane-header">Input JSON:</span>
          <textarea
            className="code-textarea"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError('')
            }}
            placeholder="Paste your JSON here..."
          />
        </div>
        <div className="editor-pane">
          <span className="pane-header">Formatted Result:</span>
          <textarea
            className="code-textarea output"
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      {error && <div className="error-banner"><AlertTriangle size={16} /> {error}</div>}
    </div>
  )
}

export function JsonValidatorTool() {
  const [input, setInput] = useState('{\n  "status": "success",\n  "code": 200\n}')
  const [validation, setValidation] = useState<{ isValid: boolean; message: string; stats?: any } | null>(null)

  const validate = () => {
    try {
      const parsed = JSON.parse(input)
      const keysCount = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1
      setValidation({
        isValid: true,
        message: 'Valid JSON format! Syntax check passed with 0 errors.',
        stats: {
          type: Array.isArray(parsed) ? 'Array' : typeof parsed,
          topLevelKeys: keysCount,
          sizeBytes: new Blob([input]).size,
        },
      })
    } catch (e: any) {
      setValidation({
        isValid: false,
        message: `Invalid JSON syntax: ${e.message}`,
      })
    }
  }

  return (
    <div className="dev-tool-container">
      <div className="dev-action-toolbar">
        <button type="button" className="button button-primary btn-sm" onClick={validate}>
          <ShieldCheck size={15} /> Validate JSON
        </button>
        <button
          type="button"
          className="button button-ghost btn-sm"
          onClick={() => {
            setInput('')
            setValidation(null)
          }}
        >
          Clear
        </button>
      </div>

      <textarea
        className="code-textarea full-height"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON text to validate..."
      />

      {validation && (
        <div className={`validation-alert ${validation.isValid ? 'valid' : 'invalid'}`}>
          <div className="alert-head">
            {validation.isValid ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
            <strong>{validation.message}</strong>
          </div>
          {validation.stats && (
            <div className="stats-inline">
              <span>Root Type: <strong>{validation.stats.type}</strong></span>
              <span>Top-level entries: <strong>{validation.stats.topLevelKeys}</strong></span>
              <span>Payload: <strong>{validation.stats.sizeBytes} bytes</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('T9#mK$2xQ!vL8@pZ')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let chars = ''
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) chars += '0123456789'
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const getStrength = () => {
    let score = 0
    if (length >= 12) score++
    if (length >= 16) score++
    if (includeUpper) score++
    if (includeNumbers) score++
    if (includeSymbols) score++
    if (score <= 2) return { label: 'Weak', color: '#ef4444', pct: 33 }
    if (score <= 4) return { label: 'Strong', color: '#f59e0b', pct: 75 }
    return { label: 'Very Strong', color: '#0b6950', pct: 100 }
  }

  const strength = getStrength()

  return (
    <div className="dev-tool-container">
      <div className="password-display-card">
        <span className="generated-password">{password}</span>
        <div className="pwd-actions">
          <button type="button" className="button button-ghost" onClick={generate} title="Regenerate">
            <RefreshCw size={16} /> New
          </button>
          <button type="button" className="button button-primary" onClick={copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="strength-bar-wrap">
        <div className="strength-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
        <span className="strength-label" style={{ color: strength.color }}>
          Strength: {strength.label}
        </span>
      </div>

      <div className="tool-settings-card">
        <div className="settings-row">
          <span className="settings-label">Password Length: <strong>{length} characters</strong></span>
          <input
            type="range"
            min={8}
            max={48}
            value={length}
            onChange={(e) => {
              setLength(Number(e.target.value))
              setTimeout(generate, 10)
            }}
            className="range-slider"
          />
        </div>

        <div className="checkbox-grid">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => {
                setIncludeUpper(e.target.checked)
                setTimeout(generate, 10)
              }}
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => {
                setIncludeLower(e.target.checked)
                setTimeout(generate, 10)
              }}
            />
            <span>Lowercase Letters (a-z)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => {
                setIncludeNumbers(e.target.checked)
                setTimeout(generate, 10)
              }}
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => {
                setIncludeSymbols(e.target.checked)
                setTimeout(generate, 10)
              }}
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [uuids, setUuids] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const list: string[] = []
    for (let i = 0; i < count; i++) {
      let u: string = crypto.randomUUID()
      if (!hyphens) u = u.replace(/-/g, '')
      if (uppercase) u = u.toUpperCase()
      list.push(u)
    }
    setUuids(list)
  }

  // initial generate if empty
  if (uuids.length === 0) {
    generate()
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="dev-tool-container">
      <div className="dev-action-toolbar">
        <button type="button" className="button button-primary btn-sm" onClick={generate}>
          <RefreshCw size={14} /> Generate UUIDs
        </button>
        <button type="button" className="button button-ghost btn-sm" onClick={copyAll}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied All' : 'Copy All'}
        </button>
      </div>

      <div className="settings-row">
        <span className="settings-label">Quantity: <strong>{count}</strong></span>
        <input
          type="range"
          min={1}
          max={25}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="range-slider max-w-xs"
        />
      </div>

      <div className="checkbox-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          <span>Uppercase</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(e) => setHyphens(e.target.checked)}
          />
          <span>Include Hyphens</span>
        </label>
      </div>

      <div className="uuid-results-list">
        {uuids.map((u, i) => (
          <div key={i} className="uuid-item">
            <code>{u}</code>
            <button
              type="button"
              className="copy-mini-btn"
              onClick={async () => {
                await navigator.clipboard.writeText(u)
              }}
              title="Copy UUID"
            >
              <Copy size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Base64Tool() {
  const [input, setInput] = useState('Hello, ToolNest!')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const process = () => {
    setError('')
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch {
      setError('Invalid input for Base64 conversion')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="dev-tool-container">
      <div className="calc-tab-strip">
        <button
          type="button"
          className={`calc-tab ${mode === 'encode' ? 'active' : ''}`}
          onClick={() => {
            setMode('encode')
            setError('')
          }}
        >
          Text to Base64 (Encode)
        </button>
        <button
          type="button"
          className={`calc-tab ${mode === 'decode' ? 'active' : ''}`}
          onClick={() => {
            setMode('decode')
            setError('')
          }}
        >
          Base64 to Text (Decode)
        </button>
      </div>

      <div className="form-field">
        <label>{mode === 'encode' ? 'Plain Text Input:' : 'Base64 Encoded Input:'}</label>
        <textarea
          className="code-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text..."
        />
      </div>

      <div className="action-row">
        <button type="button" className="button button-primary" onClick={process}>
          {mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {output && (
        <div className="form-field">
          <div className="field-header">
            <label>Output:</label>
            <button type="button" className="text-btn" onClick={copy}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="output-box">{output}</pre>
        </div>
      )}
    </div>
  )
}

export function UrlEncoderTool() {
  const [input, setInput] = useState('https://www.onlinetoolnest.tech/tools/pdf-to-ppt?source=google&query=pdf to ppt converter')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch {
      setOutput('Invalid URL formatting')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="dev-tool-container">
      <div className="calc-tab-strip">
        <button
          type="button"
          className={`calc-tab ${mode === 'encode' ? 'active' : ''}`}
          onClick={() => setMode('encode')}
        >
          URL Encode
        </button>
        <button
          type="button"
          className={`calc-tab ${mode === 'decode' ? 'active' : ''}`}
          onClick={() => setMode('decode')}
        >
          URL Decode
        </button>
      </div>

      <div className="form-field">
        <label>URL or String:</label>
        <textarea
          className="code-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste URL or query string..."
        />
      </div>

      <div className="action-row">
        <button type="button" className="button button-primary" onClick={process}>
          {mode === 'encode' ? 'Encode Component' : 'Decode URI'}
        </button>
      </div>

      {output && (
        <div className="form-field">
          <div className="field-header">
            <label>Result:</label>
            <button type="button" className="text-btn" onClick={copy}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="output-box">{output}</pre>
        </div>
      )}
    </div>
  )
}
