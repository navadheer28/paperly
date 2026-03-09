import { useState } from 'react'
import { Upload, Download, Scissors, CheckCircle, AlertCircle } from 'lucide-react'
import { splitPDF } from '../services/api'
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

export default function Split() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [splitMode, setSplitMode] = useState('visual')
  const [pageRange, setPageRange] = useState('')
  const [thumbnails, setThumbnails] = useState([])
  const [selectedPages, setSelectedPages] = useState([])
  const [numPages, setNumPages] = useState(0)
  const [loadingThumbs, setLoadingThumbs] = useState(false)
  const [mergingAll, setMergingAll] = useState(false)

  const resetAll = () => {
    setFile(null); setThumbnails([]); setSelectedPages([])
    setStatus('idle'); setResult(null); setSplitMode('visual')
    setPageRange(''); setNumPages(0)
  }

  const resetSplit = () => {
    setStatus('idle'); setResult(null)
    setSelectedPages([]); setPageRange('')
  }

  const handleFile = async (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f); setStatus('idle'); setResult(null)
      setSelectedPages([]); setThumbnails([]); setLoadingThumbs(true)
      try {
        const { thumbnails: thumbs, numPages: n } = await generateAllThumbnails(f)
        setThumbnails(thumbs); setNumPages(n)
      } catch (e) {}
      setLoadingThumbs(false)
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const togglePage = (index) => {
    setSelectedPages(prev =>
      prev.includes(index)
        ? prev.filter(p => p !== index)
        : [...prev, index].sort((a, b) => a - b)
    )
  }

  const selectAll = () => setSelectedPages([...Array(numPages).keys()])
  const clearAll = () => setSelectedPages([])

  const handleSplit = async () => {
    if (!file) return
    setStatus('splitting')
    try {
      let pages = 'all'
      if (splitMode === 'visual' && selectedPages.length > 0) {
        pages = selectedPages.map(p => p + 1).join(',')
      } else if (splitMode === 'range' && pageRange) {
        pages = pageRange
      }
      const res = await splitPDF(file, pages)
      setResult(res.data)
      setStatus('done')
    } catch (err) {
      setStatus('error')
    }
  }

  const handleDownloadAllAsOne = async () => {
    if (!result) return
    setMergingAll(true)
    try {
      const filePaths = result.files.map(f => f.downloadUrl.replace('http://localhost:5000/', ''))
      const response = await fetch('http://localhost:5000/api/pdf/merge-outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePaths })
      })
      const data = await response.json()
      if (data.downloadUrl) {
        const a = document.createElement('a')
        a.href = data.downloadUrl
        a.download = 'merged_all.pdf'
        a.click()
      }
    } catch (err) {
      alert('Something went wrong!')
    }
    setMergingAll(false)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#FEF3C7' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Split PDF</h1>
          <p className="text-gray-500 text-lg">Select pages visually or enter a custom range</p>
        </div>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: isDragging ? '2.5px dashed #EA580C' : '2.5px dashed #D1D5DB',
              backgroundColor: isDragging ? '#FFF7ED' : '#FFFFFF',
            }}
            className="rounded-3xl p-16 text-center cursor-pointer transition-all mb-6"
          >
            <div style={{ backgroundColor: '#EA580C' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Drop your PDF here</p>
            <p className="text-gray-400 text-sm">
              or{' '}
              <label className="text-orange-500 font-semibold underline cursor-pointer">
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
              <button onClick={resetAll} className="text-sm text-red-400 hover:text-red-600 underline">Remove</button>
            </div>

            <div className="flex gap-3 mb-5">
              {['visual', 'all', 'range'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setSplitMode(mode); setSelectedPages([]); setPageRange('') }}
                  style={{
                    backgroundColor: splitMode === mode ? '#EA580C' : '#F9FAFB',
                    border: splitMode === mode ? '2px solid #EA580C' : '2px solid #E5E7EB',
                  }}
                  className="px-4 py-2 rounded-xl transition-all"
                >
                  <p className={`font-bold text-sm ${splitMode === mode ? 'text-white' : 'text-gray-700'}`}>
                    {mode === 'visual' ? 'Visual Select' : mode === 'all' ? 'Split All' : 'Custom Range'}
                  </p>
                </button>
              ))}
            </div>

            {splitMode === 'range' && (
              <input
                type="text"
                placeholder="e.g. 1-3, 5, 7-9"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-gray-900 font-medium mb-4"
              />
            )}

            {splitMode === 'visual' && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-600">
                    {selectedPages.length > 0 ? `${selectedPages.length} pages selected` : 'Click pages to select'}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-xs text-orange-500 font-semibold hover:underline">Select All</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={clearAll} className="text-xs text-gray-400 font-semibold hover:underline">Clear</button>
                  </div>
                </div>
                {loadingThumbs ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-3" />
                    <p className="text-gray-500">Loading pages...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-80 overflow-y-auto pr-1">
                    {thumbnails.map((thumb, index) => (
                      <button key={index} onClick={() => togglePage(index)} className="relative flex flex-col items-center group">
                        <div
                          style={{
                            border: selectedPages.includes(index) ? '2.5px solid #EA580C' : '2px solid #E5E7EB',
                            backgroundColor: selectedPages.includes(index) ? '#FFF7ED' : '#F9FAFB',
                          }}
                          className="w-full rounded-xl overflow-hidden transition-all hover:border-orange-300"
                        >
                          <img src={thumb} alt={`Page ${index + 1}`} className="w-full object-contain" />
                        </div>
                        {selectedPages.includes(index) && (
                          <div style={{ backgroundColor: '#EA580C' }} className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1 font-medium">{index + 1}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {status === 'splitting' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Splitting your PDF...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Split into {result.files.length} files!</p>
            </div>

            <div className="space-y-2 mb-4">
              {result.files.map((f, i) => (
                <button
                  key={i}
                  onClick={() => { const a = document.createElement('a'); a.href = f.downloadUrl; a.download = f.name; a.click() }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-all group"
                >
                  <span className="font-medium text-gray-700 text-sm">{f.name}</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                </button>
              ))}
            </div>

            <button
              onClick={handleDownloadAllAsOne}
              disabled={mergingAll}
              style={{ backgroundColor: '#16A34A' }}
              className="w-full py-3 rounded-xl text-white font-bold text-sm mb-2 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {mergingAll ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download All as One PDF
                </>
              )}
            </button>

            <button
              onClick={resetSplit}
              style={{ backgroundColor: '#EA580C' }}
              className="w-full py-3 rounded-xl text-white font-bold text-sm mb-2 hover:opacity-90 transition-all"
            >
              Split Again with Same File
            </button>
            <button
              onClick={resetAll}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-400 transition-all"
            >
              Upload New File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-600">Something went wrong! Please try again.</p>
            </div>
            <button onClick={resetSplit} className="text-sm text-orange-500 font-semibold hover:underline">Try Again</button>
          </div>
        )}

        {file && status !== 'done' && status !== 'splitting' && (
          <button
            onClick={handleSplit}
            disabled={splitMode === 'visual' && selectedPages.length === 0}
            style={{ backgroundColor: (splitMode === 'visual' && selectedPages.length === 0) ? '#E5E7EB' : '#EA580C' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {splitMode === 'visual' ? `Split ${selectedPages.length} Selected Pages` : 'Split PDF'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}