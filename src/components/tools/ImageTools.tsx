import { useState } from 'react'
import { FileUp, Download } from 'lucide-react'

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
