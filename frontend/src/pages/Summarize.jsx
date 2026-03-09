import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Copy, Download } from 'lucide-react'
import { ocrPDF, summarizePDF } from '../services/api'

export default function Summarize() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [summary, setSummary] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setStatus('idle')
      setSummary('')
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const handleSummarize = async () => {
    if (!file) return
    setStatus('extracting')
    try {
      const ocrRes = await ocrPDF(file)
      setStatus('summarizing')
      const res = await summarizePDF(ocrRes.data.text)
      setSummary(res.data.summary)
      setStatus('done')
    } catch (err) {
      setStatus('error')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'summary.txt'
    a.click()
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#FEE2E2' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-red-500">AI</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Summarize PDF</h1>
          <p className="text-gray-500 text-lg">Get a smart AI summary of any PDF instantly</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border: isDragging ? '2.5px dashed #EF4444' : file ? '2.5px dashed #22C55E' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#FEF2F2' : file ? '#F0FDF4' : '#FFFFFF',
          }}
          className="rounded-3xl p-12 text-center cursor-pointer transition-all mb-6"
        >
          {file ? (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 text-lg">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">{formatSize(file.size)}</p>
              <button
                onClick={() => { setFile(null); setStatus('idle'); setSummary('') }}
                className="mt-3 text-sm text-red-400 hover:text-red-600 underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div>
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
        </div>

        {status === 'extracting' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Reading your PDF...</p>
            </div>
          </div>
        )}

        {status === 'summarizing' && (
  <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <div>
        <p className="font-semibold text-gray-700">AI is summarizing your PDF...</p>
        <p className="text-gray-400 text-xs mt-1">Analyzing first 2000 characters. Upgrade to Pro for full document summaries.</p>
      </div>
    </div>
  </div>
)}

        {status === 'done' && summary && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="font-bold text-green-600">Summary Ready!</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  style={{ backgroundColor: copied ? '#22C55E' : '#F3F4F6' }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  style={{ backgroundColor: '#EF4444' }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
            <button
              onClick={() => { setFile(null); setStatus('idle'); setSummary('') }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-4 hover:border-gray-400 transition-all"
            >
              Summarize Another File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-600">Something went wrong! Please try again.</p>
            </div>
          </div>
        )}

        {status !== 'done' && (
          <button
            onClick={handleSummarize}
            disabled={!file || status === 'extracting' || status === 'summarizing'}
            style={{ backgroundColor: file ? '#EF4444' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'extracting' ? 'Reading PDF...' : status === 'summarizing' ? 'Summarizing...' : 'Summarize PDF'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}