import { useState } from 'react'
import { Upload, Download, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { compressPDF } from '../services/api'

export default function Compress() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState('medium')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setStatus('idle')
      setResult(null)
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const handleCompress = async () => {
    if (!file) return
    setStatus('uploading')
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => prev < 90 ? prev + 10 : prev)
    }, 300)
    try {
      const res = await compressPDF(file, quality)
      clearInterval(interval)
      setProgress(100)
      setResult(res.data)
      setStatus('done')
    } catch (err) {
      clearInterval(interval)
      setStatus('error')
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const qualities = [
    { value: 'low', label: 'Maximum Compression', desc: 'Smallest file size, slightly lower quality', badge: 'Smallest' },
    { value: 'medium', label: 'Balanced', desc: 'Great quality with good size reduction', badge: 'Recommended' },
    { value: 'high', label: 'Minimum Compression', desc: 'Best quality, moderate size reduction', badge: 'Best Quality' },
  ]

  const compressionRatio = result ? (result.compressedSize / result.originalSize) * 100 : 100

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#FEF3C7' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Compress PDF</h1>
          <p className="text-gray-500 text-lg">Reduce file size while keeping maximum quality</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border: isDragging ? '2.5px dashed #EA580C' : file ? '2.5px dashed #22C55E' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#FFF7ED' : file ? '#F0FDF4' : '#FFFFFF',
          }}
          className="rounded-3xl p-10 text-center cursor-pointer transition-all mb-6"
        >
          {file ? (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 text-lg">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">{formatSize(file.size)}</p>
              <button
                onClick={() => { setFile(null); setStatus('idle'); setResult(null) }}
                className="mt-3 text-sm text-red-400 hover:text-red-600 underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div>
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
        </div>

        <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-100">
          <p className="font-bold text-gray-900 mb-4">Compression Level</p>
          <div className="flex flex-col gap-2">
            {qualities.map((q) => (
              <button
                key={q.value}
                onClick={() => setQuality(q.value)}
                style={{
                  backgroundColor: quality === q.value ? '#FFF7ED' : '#F9FAFB',
                  border: quality === q.value ? '2px solid #EA580C' : '2px solid #E5E7EB',
                }}
                className="rounded-xl px-4 py-3 text-left transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${quality === q.value ? 'text-orange-600' : 'text-gray-900'}`}>
                    {q.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{
                      backgroundColor: quality === q.value ? '#EA580C' : '#F3F4F6',
                      color: quality === q.value ? 'white' : '#6B7280'
                    }}
                  >
                    {q.badge}
                  </span>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: quality === q.value ? '5px solid #EA580C' : '2px solid #D1D5DB',
                    backgroundColor: 'white',
                    flexShrink: 0
                  }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {status === 'uploading' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex justify-between mb-2">
              <p className="font-semibold text-gray-700 text-sm">Compressing...</p>
              <p className="font-semibold text-orange-500 text-sm">{progress}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                style={{ width: `${progress}%`, backgroundColor: '#EA580C' }}
                className="h-3 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Compressed Successfully!</p>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-gray-500">Original</p>
                <p className="text-xs font-bold text-gray-700">{formatSize(result.originalSize)}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-3">
                <div className="h-4 rounded-full bg-gray-300" style={{ width: '100%' }} />
              </div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-gray-500">Compressed</p>
                <p className="text-xs font-bold text-green-600">{formatSize(result.compressedSize)}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-3">
                <div
                  className="h-4 rounded-full bg-green-400 transition-all duration-1000"
                  style={{ width: `${Math.max(compressionRatio, 5)}%` }}
                />
              </div>
              <div className="flex items-center justify-center mt-3">
                <div style={{ backgroundColor: '#FEF3C7' }} className="px-4 py-2 rounded-xl">
                  <p className="text-sm font-black text-orange-600">🎉 {result.savedPercent}% smaller!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'compressed.pdf'; a.click() }}
              style={{ backgroundColor: '#EA580C' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Compressed PDF
            </button>
            <button
              onClick={() => { setStatus('idle'); setResult(null); setProgress(0) }}
              style={{ border: '2px solid #EA580C' }}
              className="w-full py-3 rounded-xl text-orange-500 font-bold text-sm mt-2 hover:bg-orange-50 transition-all"
            >
              Try Different Quality
            </button>
            <button
              onClick={() => { setFile(null); setStatus('idle'); setResult(null); setProgress(0) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Compress Another File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-600">Something went wrong! Please try again.</p>
            </div>
            <button onClick={() => setStatus('idle')} className="text-sm text-orange-500 font-semibold hover:underline">Try Again</button>
          </div>
        )}

        {status !== 'done' && (
          <button
            onClick={handleCompress}
            disabled={!file || status === 'uploading'}
            style={{ backgroundColor: file ? '#EA580C' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'uploading' ? 'Compressing...' : 'Compress PDF'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}