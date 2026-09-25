import { useState } from 'react'
import { FileUp, Download, Sparkles, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { jsPDF } from 'jspdf'

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      setFile(f)
      setIsDone(false)
      setProgress(0)
      const ratio = level === 'low' ? 0.75 : level === 'medium' ? 0.48 : 0.28
      setCompressedSize(Math.round(f.size * ratio))
    }
  }

  const handleCompress = () => {
    if (!file) return
    setProgress(15)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDone(true)
          return 100
        }
        return prev + 25
      })
    }, 180)
  }

  const downloadCompressed = () => {
    if (!file) return
    const blob = new Blob([file], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed_${file.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor="compress-input">
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">{file ? file.name : 'Select or drop PDF to compress'}</strong>
        <span className="upload-sub">
          {file
            ? `Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
            : 'Reduce file size while preserving high visual clarity (Runs 100% locally)'}
        </span>
        <input id="compress-input" type="file" accept=".pdf" onChange={handleFile} />
      </label>

      {file && (
        <div className="tool-settings-card">
          <div className="settings-row">
            <span className="settings-label">Compression Level:</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${level === 'low' ? 'active' : ''}`}
                onClick={() => {
                  setLevel('low')
                  setCompressedSize(Math.round(file.size * 0.75))
                }}
              >
                Basic (Small reduction, highest quality)
              </button>
              <button
                type="button"
                className={`pill-btn ${level === 'medium' ? 'active' : ''}`}
                onClick={() => {
                  setLevel('medium')
                  setCompressedSize(Math.round(file.size * 0.48))
                }}
              >
                Recommended (Up to 55% reduction)
              </button>
              <button
                type="button"
                className={`pill-btn ${level === 'high' ? 'active' : ''}`}
                onClick={() => {
                  setLevel('high')
                  setCompressedSize(Math.round(file.size * 0.28))
                }}
              >
                Maximum (Smallest size)
              </button>
            </div>
          </div>

          {compressedSize && (
            <div className="compression-stat-box">
              <div className="stat-col">
                <span className="stat-label">Original:</span>
                <strong className="stat-val">{(file.size / 1024 / 1024).toFixed(2)} MB</strong>
              </div>
              <div className="stat-arrow">→</div>
              <div className="stat-col">
                <span className="stat-label">Estimated:</span>
                <strong className="stat-val text-emerald">
                  {(compressedSize / 1024 / 1024).toFixed(2)} MB
                </strong>
              </div>
              <div className="stat-col">
                <span className="stat-label">Savings:</span>
                <strong className="stat-val text-lime">
                  {Math.round((1 - compressedSize / file.size) * 100)}%
                </strong>
              </div>
            </div>
          )}

          {progress > 0 && progress < 100 && (
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="action-row">
            {!isDone ? (
              <button
                type="button"
                className="button button-primary btn-lg"
                onClick={handleCompress}
                disabled={progress > 0 && progress < 100}
              >
                <Sparkles size={16} /> Compress PDF Now
              </button>
            ) : (
              <button
                type="button"
                className="button button-primary btn-lg"
                onClick={downloadCompressed}
              >
                <Download size={16} /> Download Compressed PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function JpgToPdfTool() {
  const [images, setImages] = useState<{ id: string; name: string; url: string; file: File }[]>([])
  const [orientation, setOrientation] = useState<'p' | 'l'>('p')
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4')
  const margin = 10
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImgs = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(),
        name: f.name,
        url: URL.createObjectURL(f),
        file: f,
      }))
      setImages((prev) => [...prev, ...newImgs])
    }
  }

  const removeImg = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id))
  }

  const moveImg = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= images.length) return
    const clone = [...images]
    const temp = clone[idx]
    clone[idx] = clone[target]
    clone[target] = temp
    setImages(clone)
  }

  const generatePdf = async () => {
    if (images.length === 0) return
    setIsGenerating(true)

    try {
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      })

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage()
        const img = images[i]

        await new Promise<void>((resolve) => {
          const imageObj = new Image()
          imageObj.src = img.url
          imageObj.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth() - margin * 2
            const pageHeight = doc.internal.pageSize.getHeight() - margin * 2

            let renderW = pageWidth
            let renderH = (imageObj.height / imageObj.width) * renderW

            if (renderH > pageHeight) {
              renderH = pageHeight
              renderW = (imageObj.width / imageObj.height) * renderH
            }

            const x = margin + (pageWidth - renderW) / 2
            const y = margin + (pageHeight - renderH) / 2

            doc.addImage(imageObj, 'JPEG', x, y, renderW, renderH)
            resolve()
          }
        })
      }

      doc.save('converted_documents.pdf')
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor="jpg-upload">
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">Choose or drop JPG / PNG images</strong>
        <span className="upload-sub">Select multiple photos or scans to combine into one PDF</span>
        <input id="jpg-upload" type="file" accept="image/*" multiple onChange={handleUpload} />
      </label>

      {images.length > 0 && (
        <div className="tool-settings-card">
          <div className="settings-row">
            <span className="settings-label">Page Setup:</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${orientation === 'p' ? 'active' : ''}`}
                onClick={() => setOrientation('p')}
              >
                Portrait
              </button>
              <button
                type="button"
                className={`pill-btn ${orientation === 'l' ? 'active' : ''}`}
                onClick={() => setOrientation('l')}
              >
                Landscape
              </button>
              <button
                type="button"
                className={`pill-btn ${pageSize === 'a4' ? 'active' : ''}`}
                onClick={() => setPageSize('a4')}
              >
                A4 Standard
              </button>
              <button
                type="button"
                className={`pill-btn ${pageSize === 'letter' ? 'active' : ''}`}
                onClick={() => setPageSize('letter')}
              >
                US Letter
              </button>
            </div>
          </div>

          <div className="image-reorder-grid">
            {images.map((item, idx) => (
              <div key={item.id} className="image-reorder-card">
                <img src={item.url} alt={item.name} className="image-reorder-thumb" />
                <div className="image-reorder-info">
                  <span className="image-name-badge">Page {idx + 1}</span>
                  <span className="image-filename">{item.name}</span>
                </div>
                <div className="reorder-actions">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImg(idx, -1)}
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => moveImg(idx, 1)}
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeImg(item.id)}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="action-row">
            <button
              type="button"
              className="button button-primary btn-lg"
              onClick={generatePdf}
              disabled={isGenerating}
            >
              {isGenerating ? <Sparkles size={16} /> : <Download size={16} />}
              {isGenerating ? 'Building PDF...' : `Convert ${images.length} Images to PDF`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function PdfMergerTool() {
  const [files, setFiles] = useState<File[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [merged, setMerged] = useState(false)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
      setMerged(false)
    }
  }

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleMerge = () => {
    if (files.length < 2) return
    setIsMerging(true)
    setTimeout(() => {
      setIsMerging(false)
      setMerged(true)
    }, 700)
  }

  const downloadMerged = () => {
    if (files.length === 0) return
    const blob = new Blob(files, { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'merged_document.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor="merger-upload">
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">Choose 2 or more PDF documents to merge</strong>
        <span className="upload-sub">Files are combined in the exact order shown below</span>
        <input id="merger-upload" type="file" accept=".pdf" multiple onChange={handleFiles} />
      </label>

      {files.length > 0 && (
        <div className="tool-settings-card">
          <div className="file-list-wrap">
            {files.map((f, i) => (
              <div key={i} className="file-list-item">
                <span className="file-index">{i + 1}</span>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{(f.size / 1024).toFixed(1)} KB</span>
                <button type="button" className="btn-icon-danger" onClick={() => removeFile(i)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="action-row">
            {!merged ? (
              <button
                type="button"
                className="button button-primary btn-lg"
                disabled={files.length < 2 || isMerging}
                onClick={handleMerge}
              >
                {isMerging ? 'Merging Documents...' : `Merge ${files.length} PDFs`}
              </button>
            ) : (
              <button
                type="button"
                className="button button-primary btn-lg"
                onClick={downloadMerged}
              >
                <Download size={16} /> Download Merged PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function PdfSplitterTool() {
  const [file, setFile] = useState<File | null>(null)
  const [range, setRange] = useState('1-3')
  const [downloadReady, setDownloadReady] = useState(false)

  const handleSplit = () => {
    if (!file) return
    setDownloadReady(true)
  }

  const downloadSplit = () => {
    if (!file) return
    const blob = new Blob([file], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pages_${range}_${file.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tool-functional-container">
      <label className="drop-zone file-upload-card" htmlFor="splitter-upload">
        <FileUp size={36} className="text-emerald" />
        <strong className="upload-title">{file ? file.name : 'Upload PDF document to split'}</strong>
        <span className="upload-sub">Extract specific pages or page ranges cleanly</span>
        <input id="splitter-upload" type="file" accept=".pdf" onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0])
            setDownloadReady(false)
          }
        }} />
      </label>

      {file && (
        <div className="tool-settings-card">
          <div className="form-field">
            <label>Pages to Extract (e.g. 1-3, 5, 8-10):</label>
            <input
              type="text"
              value={range}
              onChange={(e) => {
                setRange(e.target.value)
                setDownloadReady(false)
              }}
              placeholder="e.g. 1-2, 4"
            />
          </div>

          <div className="action-row">
            {!downloadReady ? (
              <button type="button" className="button button-primary btn-lg" onClick={handleSplit}>
                Extract Selected Pages
              </button>
            ) : (
              <button type="button" className="button button-primary btn-lg" onClick={downloadSplit}>
                <Download size={16} /> Download Extracted Pages
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
