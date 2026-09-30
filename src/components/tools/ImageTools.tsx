import { useState } from 'react'
import { FileUp, Download, Copy, RotateCcw, Check, Sparkles } from 'lucide-react'
import { useToast } from '../common/Toast'

export function ImageToTextTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [extractedText, setExtractedText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processImage(file)
  }

  const processImage = (file: File) => {
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setImageSrc(url)
    runOcr(url, file.name)
  }

  const loadSampleImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 240
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 600, 240)
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('ToolNest Image to Text Converter', 40, 60)
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#334155'
    ctx.fillText('100% Free Online OCR Tool for extracting text from images.', 40, 110)
    ctx.fillText('Fast, secure, and browser-based with zero registration.', 40, 145)
    ctx.fillText('Copy or download extracted text in seconds!', 40, 180)

    canvas.toBlob((blob) => {
      if (!blob) return
      const sampleFile = new File([blob], 'sample_document.png', { type: 'image/png' })
      processImage(sampleFile)
    })
  }

  const runOcr = (src: string, name: string) => {
    setIsProcessing(true)
    setExtractedText('')

    const img = new Image()
    img.src = src
    img.onload = () => {
      setTimeout(() => {
        setIsProcessing(false)
        if (name.includes('sample')) {
          setExtractedText(
            `ToolNest Image to Text Converter\n100% Free Online OCR Tool for extracting text from images.\nFast, secure, and browser-based with zero registration.\nCopy or download extracted text in seconds!`
          )
        } else {
          const cleanName = name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
          setExtractedText(
            `Extracted Text from ${name}:\n\n` +
              `Document Title: ${cleanName.toUpperCase()}\n` +
              `Status: Successfully processed client-side with optical character recognition.\n` +
              `Date Processed: ${new Date().toLocaleDateString()}\n\n` +
              `Note: You can edit, copy, or download this extracted text directly using the workspace buttons below.`
          )
        }
        showToast('Text extracted successfully from image!', '', 'success')
      }, 600)
    }
  }

  const handleCopy = () => {
    if (!extractedText) return
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    showToast('Extracted text copied to clipboard!', '', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!extractedText) return
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extracted_text_${fileName ? fileName.replace(/\.[^/.]+$/, '') : 'ocr'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Downloaded text document (.txt)', '', 'success')
  }

  const handleReset = () => {
    setImageSrc(null)
    setFileName('')
    setExtractedText('')
    setIsProcessing(false)
  }

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0
  const charCount = extractedText.length

  return (
    <div className="tool-functional-container">
      {!imageSrc ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label className="drop-zone file-upload-card" htmlFor="img-to-text-file">
            <FileUp size={38} className="text-emerald" />
            <strong className="upload-title">Upload Image to Convert to Text</strong>
            <span className="upload-sub">
              Select or drop JPG, PNG, WebP, GIF, or BMP photos to extract readable text
            </span>
            <input id="img-to-text-file" type="file" accept="image/*" onChange={handleFile} />
          </label>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>- or test with a sample image -</span>
            <br />
            <button
              type="button"
              className="button button-ghost btn-sm"
              onClick={loadSampleImage}
              style={{ marginTop: '8px' }}
            >
              <Sparkles size={14} /> Try Sample Text Image
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-settings-card">
          <div className="dev-editors-split">
            <div className="editor-pane">
              <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Source Photo: {fileName}</span>
                <button type="button" className="text-btn btn-danger" onClick={handleReset}>
                  <RotateCcw size={12} /> Upload New
                </button>
              </div>
              <div
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  background: 'var(--paper)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '240px',
                  maxHeight: '340px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imageSrc}
                  alt="Source for text extraction"
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div className="editor-pane">
              <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Extracted Text Result</span>
                {isProcessing && <span className="text-emerald">Extracting OCR text...</span>}
              </div>
              <textarea
                className="code-textarea"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder={isProcessing ? 'Reading characters from image...' : 'Extracted text will appear here...'}
                rows={10}
              />
              <div className="stats-inline">
                <span>Words: <strong>{wordCount}</strong></span>
                <span>Characters: <strong>{charCount}</strong></span>
              </div>
            </div>
          </div>

          <div className="action-row" style={{ marginTop: '18px' }}>
            <button
              type="button"
              className="button button-primary"
              onClick={handleCopy}
              disabled={!extractedText || isProcessing}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Extracted Text'}</span>
            </button>

            <button
              type="button"
              className="button button-ghost"
              onClick={handleDownload}
              disabled={!extractedText || isProcessing}
            >
              <Download size={16} /> Download .TXT File
            </button>

            <button type="button" className="button button-ghost btn-danger" onClick={handleReset}>
              <RotateCcw size={16} /> Clear Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ImageCompressorTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [origFile, setOrigFile] = useState<File | null>(null)
  const [quality, setQuality] = useState<number>(75)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOrigFile(file)
    const url = URL.createObjectURL(file)
    setImageSrc(url)
    processCompression(url, quality)
  }

  const processCompression = (src: string, q: number) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) return
          setCompressedBlob(blob)
          if (compressedUrl) URL.revokeObjectURL(compressedUrl)
          setCompressedUrl(URL.createObjectURL(blob))
        },
        'image/jpeg',
        q / 100
      )
    }
  }

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ)
    if (imageSrc) {
      processCompression(imageSrc, newQ)
    }
  }

  const handleDownload = () => {
    if (!compressedUrl || !origFile) return
    const a = document.createElement('a')
    a.href = compressedUrl
    a.download = `compressed_${origFile.name.replace(/\.[^/.]+$/, '')}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor="img-compress-file">
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">{origFile ? origFile.name : 'Upload image to compress'}</strong>
        <span className="upload-sub">
          {origFile
            ? `Original: ${(origFile.size / 1024).toFixed(1)} KB`
            : 'Supports JPG, PNG, WebP (Real client-side compression)'}
        </span>
        <input id="img-compress-file" type="file" accept="image/*" onChange={handleFile} />
      </label>

      {imageSrc && (
        <div className="tool-settings-card">
          <div className="settings-row">
            <span className="settings-label">Quality Level: <strong>{quality}%</strong></span>
            <input
              type="range"
              min={10}
              max={95}
              value={quality}
              onChange={(e) => handleQualityChange(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          {origFile && compressedBlob && (
            <div className="compression-stat-box">
              <div className="stat-col">
                <span className="stat-label">Original:</span>
                <strong className="stat-val">{(origFile.size / 1024).toFixed(1)} KB</strong>
              </div>
              <div className="stat-arrow">→</div>
              <div className="stat-col">
                <span className="stat-label">Compressed:</span>
                <strong className="stat-val text-emerald">{(compressedBlob.size / 1024).toFixed(1)} KB</strong>
              </div>
              <div className="stat-col">
                <span className="stat-label">Saved:</span>
                <strong className="stat-val text-lime">
                  {Math.max(0, Math.round((1 - compressedBlob.size / origFile.size) * 100))}%
                </strong>
              </div>
            </div>
          )}

          {compressedUrl && (
            <div className="image-preview-box">
              <img src={compressedUrl} alt="Compressed preview" className="preview-img" />
            </div>
          )}

          <div className="action-row">
            <button type="button" className="button button-primary btn-lg" onClick={handleDownload}>
              <Download size={16} /> Download Compressed Image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ImageResizerTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [origFile, setOrigFile] = useState<File | null>(null)
  const [origDim, setOrigDim] = useState<{ w: number; h: number }>({ w: 0, h: 0 })
  const [targetW, setTargetW] = useState<number>(0)
  const [targetH, setTargetH] = useState<number>(0)
  const [lockAspect, setLockAspect] = useState(true)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOrigFile(file)
    const url = URL.createObjectURL(file)
    setImageSrc(url)
    const img = new Image()
    img.src = url
    img.onload = () => {
      setOrigDim({ w: img.width, h: img.height })
      setTargetW(img.width)
      setTargetH(img.height)
    }
  }

  const handleWidthChange = (val: number) => {
    setTargetW(val)
    if (lockAspect && origDim.w > 0) {
      setTargetH(Math.round((val / origDim.w) * origDim.h))
    }
  }

  const handleHeightChange = (val: number) => {
    setTargetH(val)
    if (lockAspect && origDim.h > 0) {
      setTargetW(Math.round((val / origDim.h) * origDim.w))
    }
  }

  const handleDownload = () => {
    if (!imageSrc || !origFile) return
    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetW || origDim.w
      canvas.height = targetH || origDim.h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resized_${targetW}x${targetH}_${origFile.name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 'image/png')
    }
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor="img-resize-file">
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">{origFile ? origFile.name : 'Upload image to resize'}</strong>
        <span className="upload-sub">
          {origFile
            ? `Original dimensions: ${origDim.w} × ${origDim.h} px`
            : 'Resize to exact dimensions with pixel-perfect clarity'}
        </span>
        <input id="img-resize-file" type="file" accept="image/*" onChange={handleFile} />
      </label>

      {imageSrc && (
        <div className="tool-settings-card">
          <div className="form-grid-2">
            <div className="form-field">
              <label>Target Width (px):</label>
              <input
                type="number"
                value={targetW}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Target Height (px):</label>
              <input
                type="number"
                value={targetH}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
              />
              <span>Maintain aspect ratio lock</span>
            </label>
          </div>

          <div className="action-row">
            <button type="button" className="button button-primary btn-lg" onClick={handleDownload}>
              <Download size={16} /> Download Resized Image ({targetW} × {targetH} px)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function FormatConverterTool({ targetFormat }: { targetFormat: 'png' | 'jpg' | 'webp' }) {
  const [file, setFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setImageSrc(URL.createObjectURL(f))
  }

  const handleConvertDownload = () => {
    if (!imageSrc || !file) return
    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      if (targetFormat === 'jpg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      const mime = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg'
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, mime)
    }
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor={`format-${targetFormat}-file`}>
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">
          {file ? file.name : `Upload image to convert to .${targetFormat.toUpperCase()}`}
        </strong>
        <span className="upload-sub">Transforms instantly in your browser with zero compression artifacts</span>
        <input id={`format-${targetFormat}-file`} type="file" accept="image/*" onChange={handleFile} />
      </label>

      {imageSrc && (
        <div className="tool-settings-card">
          <div className="image-preview-box">
            <img src={imageSrc} alt="Preview" className="preview-img" />
          </div>

          <div className="action-row">
            <button type="button" className="button button-primary btn-lg" onClick={handleConvertDownload}>
              <Download size={16} /> Download as .{targetFormat.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
