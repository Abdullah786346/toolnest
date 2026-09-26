import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { useToast } from '../common/Toast'

export function ColorConverterTool() {
  const [hex, setHex] = useState('#0B6950')
  const { showToast } = useToast()

  const hexToRgb = (h: string) => {
    let clean = h.replace('#', '')
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('')
    }
    if (clean.length !== 6) return null
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b }
  }

  const rgb = hexToRgb(hex)

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  const copyText = async (val: string, label: string) => {
    await navigator.clipboard.writeText(val)
    showToast(`Copied ${label}: ${val}`, '', 'success')
  }

  const generateRandomHex = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setHex(randomColor.toUpperCase())
  }

  return (
    <div className="dev-tool-container">
      <div className="color-preview-banner" style={{ background: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '#0b6950' }}>
        <div className="color-picker-badge">
          <input
            type="color"
            value={hex.length === 7 ? hex : '#0b6950'}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            title="Pick a color"
          />
          <span>Click color block to pick custom color</span>
        </div>
      </div>

      <div className="tool-settings-card">
        <div className="settings-row">
          <span className="settings-label">HEX Code:</span>
          <div className="flex-input-wrap">
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#000000"
              className="mono-input"
            />
            <button type="button" className="button button-ghost btn-sm" onClick={generateRandomHex}>
              <RefreshCw size={14} /> Random
            </button>
          </div>
        </div>

        {rgb && hsl && (
          <div className="color-formats-grid">
            <div className="color-format-card">
              <span className="format-type">HEX</span>
              <strong className="format-val">{hex}</strong>
              <button
                type="button"
                className="copy-mini-btn"
                onClick={() => copyText(hex, 'HEX')}
                title="Copy HEX"
              >
                <Copy size={14} />
              </button>
            </div>

            <div className="color-format-card">
              <span className="format-type">RGB</span>
              <strong className="format-val">rgb({rgb.r}, {rgb.g}, {rgb.b})</strong>
              <button
                type="button"
                className="copy-mini-btn"
                onClick={() => copyText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                title="Copy RGB"
              >
                <Copy size={14} />
              </button>
            </div>

            <div className="color-format-card">
              <span className="format-type">HSL</span>
              <strong className="format-val">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</strong>
              <button
                type="button"
                className="copy-mini-btn"
                onClick={() => copyText(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                title="Copy HSL"
              >
                <Copy size={14} />
              </button>
            </div>

            <div className="color-format-card">
              <span className="format-type">CSS Variable</span>
              <strong className="format-val">--color-primary: {hex};</strong>
              <button
                type="button"
                className="copy-mini-btn"
                onClick={() => copyText(`--color-primary: ${hex};`, 'CSS Variable')}
                title="Copy CSS"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
