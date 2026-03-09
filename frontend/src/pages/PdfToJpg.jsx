import { useState } from 'react'
import { Upload, Download, CheckCircle, AlertCircle, Image } from 'lucide-react'
import { pdfToJpg } from '../services/api'
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

export default function PdfToJpg() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [quality, setQuality] = useState('high')
  const [thumbnails, setThumbnails] = useState([])
  const [numPages, setNumPages] = useState(0)
  const [loadingThumbs, setLoadingThumbs] = useState(false)

  const handleFile = async (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f); setStatus('idle'); setResult(null)
      setThumbnails([]); setLoadingThumbs(true)
      try {
        const { thumbnails: thumbs, numPages: n } = await generateAllThumbnails(f)
        setThumbnails(thumbs); setNumPages(n)
      } catch (e) {}
      setLoadingThumbs(false)
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setStatus('converting')
    try {
      const res = await pdfToJpg(file, quality)
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

  const qualities = [
    { value: 'low', label: 'Low', desc: '72 DPI' },
    { value: 'medium', label: 'Medium', desc: '150 DPI' },
    { value: 'high', label: 'High', desc: '300 DPI' },
  ]

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#FEE2E2' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">PDF to JPG</h1>
          <p className="text-gray-500 text-lg">Convert each PDF page into a JPG image</p>
        </div>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: isDragging ? '2.5px dashed #EF4444' : '2.5px dashed #D1D5DB',
              backgroundColor: isDragging ? '#FEF2F2' : '#FFFFFF',
            }}
            className="rounded-3xl p-16 text-center cursor-pointer transition-all mb-6"
          >
            <div style={{ backgroundColor: '#EF4444' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Drop your PDF here</p>
            <p className="text-gray-400 text-sm">
              or{' '}
              <label className="text-red-500 font-semibold underline cursor-pointer">
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
              <button
                onClick={() => { setFile(null); setThumbnails([]); setStatus('idle'); setResult(null) }}
                className="text-sm text-red-400 hover:text-red-600 underline"
              >
                Remove
              </button>
            </div>

            {loadingThumbs ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-3" />
                <p className="text-gray-500">Loading pages...</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-600 mb-3">Pages to convert ({numPages})</p>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto pr-1">
                  {thumbnails.map((thumb, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 w-full">
                        <img src={thumb} alt={`Page ${index + 1}`} className="w-full object-contain" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{index + 1}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {file && status !== 'done' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <p className="font-bold text-gray-900 mb-4">Image Quality</p>
            <div className="grid grid-cols-3 gap-3">
              {qualities.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  style={{
                    backgroundColor: quality === q.value ? '#EF4444' : '#F9FAFB',
                    border: quality === q.value ? '2px solid #EF4444' : '2px solid #E5E7EB',
                  }}
                  className="rounded-xl p-4 text-center transition-all"
                >
                  <p className={`font-bold text-sm ${quality === q.value ? 'text-white' : 'text-gray-900'}`}>{q.label}</p>
                  <p className={`text-xs mt-1 ${quality === q.value ? 'text-red-100' : 'text-gray-400'}`}>{q.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {status === 'converting' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Converting pages to JPG...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Converted {result.files.length} pages!</p>
            </div>

            {/* Image previews grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              {result.files.map((f, i) => (
                <button
                  key={i}
                  onClick={() => { const a = document.createElement('a'); a.href = f.downloadUrl; a.download = f.name; a.click() }}
                  className="group relative rounded-xl overflow-hidden border-2 border-gray-100 hover:border-red-300 transition-all"
                >
                  <img
                    src={f.downloadUrl}
                    alt={f.name}
                    className="w-full object-contain bg-gray-50"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all bg-white rounded-xl px-3 py-2 flex items-center gap-1">
                      <Download className="w-4 h-4 text-gray-700" />
                      <span className="text-xs font-bold text-gray-700">Download</span>
                    </div>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-500 font-medium truncate">{f.name}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setFile(null); setThumbnails([]); setStatus('idle'); setResult(null) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-400 transition-all"
            >
              Convert Another File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-600">Something went wrong! Please try again.</p>
            </div>
            <button onClick={() => setStatus('idle')} className="text-sm text-red-500 font-semibold hover:underline">Try Again</button>
          </div>
        )}

        {status !== 'done' && (
          <button
            onClick={handleConvert}
            disabled={!file || status === 'converting'}
            style={{ backgroundColor: file ? '#EF4444' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'converting' ? 'Converting...' : 'Convert to JPG'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}