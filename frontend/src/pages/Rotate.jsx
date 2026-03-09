import { useState } from 'react'
import { Upload, Download, RotateCw, CheckCircle, AlertCircle } from 'lucide-react'
import { rotatePDF } from '../services/api'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

async function generateAllThumbnails(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const thumbnails = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 0.3 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    thumbnails.push(canvas.toDataURL())
  }
  return { thumbnails, numPages: pdf.numPages }
}

export default function Rotate() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [thumbnails, setThumbnails] = useState([])
  const [numPages, setNumPages] = useState(0)
  const [loadingThumbs, setLoadingThumbs] = useState(false)
  const [pageRotations, setPageRotations] = useState({})
  const [globalRotation, setGlobalRotation] = useState(90)
  const [rotateMode, setRotateMode] = useState('all')

  const resetAll = () => {
    setFile(null); setThumbnails([]); setPageRotations({})
    setStatus('idle'); setResult(null); setNumPages(0)
  }

  const handleFile = async (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f); setStatus('idle'); setResult(null)
      setThumbnails([]); setPageRotations({}); setLoadingThumbs(true)
      try {
        const { thumbnails: thumbs, numPages: n } = await generateAllThumbnails(f)
        setThumbnails(thumbs); setNumPages(n)
      } catch (e) {}
      setLoadingThumbs(false)
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const rotatePage = (index, degrees) => {
    setPageRotations(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + degrees + 360) % 360
    }))
  }

  const rotateAll = (degrees) => {
    const newRotations = {}
    for (let i = 0; i < numPages; i++) {
      newRotations[i] = ((pageRotations[i] || 0) + degrees + 360) % 360
    }
    setPageRotations(newRotations)
  }

  const handleRotate = async () => {
    if (!file) return
    setStatus('rotating')
    try {
      let degrees = globalRotation
      if (rotateMode === 'visual') {
        const hasRotations = Object.values(pageRotations).some(r => r !== 0)
        if (!hasRotations) {
          alert('Please rotate at least one page!')
          setStatus('idle')
          return
        }
        degrees = JSON.stringify(pageRotations)
      }
      const res = await rotatePDF(file, degrees)
      setResult(res.data)
      setStatus('done')
    } catch (err) {
      setStatus('error')
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const rotationOptions = [
    { value: 90, label: '90° Right', icon: '↻' },
    { value: 180, label: '180°', icon: '↕' },
    { value: 270, label: '90° Left', icon: '↺' },
  ]

  const T = '#0D9488'
  const TL = '#CCFBF1'

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: TL }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RotateCw className="w-8 h-8" style={{ color: T }} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Rotate PDF</h1>
          <p className="text-gray-500 text-lg">Rotate all pages or select individual pages</p>
        </div>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: isDragging ? `2.5px dashed ${T}` : '2.5px dashed #D1D5DB',
              backgroundColor: isDragging ? TL : '#FFFFFF',
            }}
            className="rounded-3xl p-16 text-center cursor-pointer transition-all mb-6"
          >
            <div style={{ backgroundColor: T }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Drop your PDF here</p>
            <p className="text-gray-400 text-sm">
              or{' '}
              <label style={{ color: T }} className="font-semibold underline cursor-pointer">
                browse files
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </label>
            </p>
          </div>
        )}

        {file && status !== 'done' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-bold text-gray-900">{file.name}</p>
                <p className="text-gray-400 text-sm">{numPages} pages · {formatSize(file.size)}</p>
              </div>
              <button onClick={resetAll} className="text-sm text-gray-400 hover:text-gray-600 underline">Remove</button>
            </div>

            <div className="flex gap-3 mb-5">
              {['all', 'visual'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRotateMode(mode)}
                  style={{
                    backgroundColor: rotateMode === mode ? T : '#F9FAFB',
                    border: rotateMode === mode ? `2px solid ${T}` : '2px solid #E5E7EB',
                  }}
                  className="px-4 py-2 rounded-xl transition-all"
                >
                  <p className={`font-bold text-sm ${rotateMode === mode ? 'text-white' : 'text-gray-700'}`}>
                    {mode === 'all' ? 'Rotate All Pages' : 'Visual Select'}
                  </p>
                </button>
              ))}
            </div>

            {rotateMode === 'all' && (
              <div className="grid grid-cols-3 gap-3">
                {rotationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGlobalRotation(opt.value)}
                    style={{
                      backgroundColor: globalRotation === opt.value ? T : '#F9FAFB',
                      border: globalRotation === opt.value ? `2px solid ${T}` : '2px solid #E5E7EB',
                    }}
                    className="rounded-xl p-4 text-center transition-all"
                  >
                    <span className={`text-2xl block mb-1 ${globalRotation === opt.value ? 'text-white' : 'text-gray-400'}`}>
                      {opt.icon}
                    </span>
                    <p className={`font-bold text-xs ${globalRotation === opt.value ? 'text-white' : 'text-gray-700'}`}>
                      {opt.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {rotateMode === 'visual' && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-600">Click arrows to rotate each page</p>
                  <div className="flex gap-2">
                    <button onClick={() => rotateAll(90)} style={{ color: T }} className="text-xs font-semibold hover:underline">Rotate All ↻</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => setPageRotations({})} className="text-xs text-gray-400 font-semibold hover:underline">Reset All</button>
                  </div>
                </div>

                {loadingThumbs ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3" style={{ borderColor: T, borderTopColor: 'transparent' }} />
                    <p className="text-gray-500">Loading pages...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto pr-1">
                    {thumbnails.map((thumb, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 w-full mb-2">
                          <img
                            src={thumb}
                            alt={`Page ${index + 1}`}
                            className="w-full object-contain transition-transform duration-300"
                            style={{ transform: `rotate(${pageRotations[index] || 0}deg)` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Page {index + 1}</p>
                        {pageRotations[index] ? (
                          <p className="text-xs font-bold" style={{ color: T }}>{pageRotations[index]}°</p>
                        ) : null}
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => rotatePage(index, -90)}
                            className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 transition-all text-sm font-bold hover:text-white"
                            style={{ ':hover': { backgroundColor: T } }}
                            onMouseEnter={e => e.target.style.backgroundColor = TL}
                            onMouseLeave={e => e.target.style.backgroundColor = '#F3F4F6'}
                          >↺</button>
                          <button
                            onClick={() => rotatePage(index, 90)}
                            className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 transition-all text-sm font-bold"
                            onMouseEnter={e => e.target.style.backgroundColor = TL}
                            onMouseLeave={e => e.target.style.backgroundColor = '#F3F4F6'}
                          >↻</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {status === 'rotating' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: T, borderTopColor: 'transparent' }} />
              <p className="font-semibold text-gray-700">Rotating your PDF...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Rotated Successfully!</p>
            </div>
            <button
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'rotated.pdf'; a.click() }}
              style={{ backgroundColor: T }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Rotated PDF
            </button>
            <button
              onClick={() => { setStatus('idle'); setResult(null); setPageRotations({}) }}
              style={{ backgroundColor: T }}
              className="w-full py-3 rounded-xl text-white font-bold text-sm mt-2 hover:opacity-90 transition-all opacity-80"
            >
              Rotate Again with Same File
            </button>
            <button
              onClick={resetAll}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Upload New File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-teal-50 rounded-2xl p-6 mb-6 border border-teal-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5" style={{ color: T }} />
              <p className="font-bold" style={{ color: T }}>Something went wrong! Please try again.</p>
            </div>
            <button onClick={() => setStatus('idle')} style={{ color: T }} className="text-sm font-semibold hover:underline">Try Again</button>
          </div>
        )}

        {file && status !== 'done' && status !== 'rotating' && (
          <button
            onClick={handleRotate}
            style={{ backgroundColor: T }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90"
          >
            Rotate PDF
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}