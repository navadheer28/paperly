import { useState } from 'react'
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { addPageNumbers } from '../services/api'

export default function PageNumbers() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState('bottom-center')
  const [startNumber, setStartNumber] = useState(1)
  const [fontSize, setFontSize] = useState(12)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setStatus('idle')
      setResult(null)
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const handleAdd = async () => {
    if (!file) return
    setStatus('processing')
    try {
      const res = await addPageNumbers(file, position, startNumber, fontSize)
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

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ]

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#F0FDF4' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-green-600">1/n</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Page Numbers</h1>
          <p className="text-gray-500 text-lg">Add page numbers to your PDF document</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border: isDragging ? '2.5px dashed #16A34A' : file ? '2.5px dashed #22C55E' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#F0FDF4' : file ? '#F0FDF4' : '#FFFFFF',
          }}
          className="rounded-3xl p-12 text-center cursor-pointer transition-all mb-6"
        >
          {file ? (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 text-lg">{file.name}</p>
              <p className="text-gray-400 text-sm mt-1">{formatSize(file.size)}</p>
              <button onClick={() => { setFile(null); setStatus('idle'); setResult(null) }} className="mt-3 text-sm text-red-400 hover:text-red-600 underline">
                Remove file
              </button>
            </div>
          ) : (
            <div>
              <div style={{ backgroundColor: '#16A34A' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <p className="font-bold text-gray-900 text-lg mb-1">Drop your PDF here</p>
              <p className="text-gray-400 text-sm">
                or{' '}
                <label className="text-green-500 font-semibold underline cursor-pointer">
                  browse files
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 space-y-5">
          <p className="font-bold text-gray-900">Page Number Settings</p>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  style={{
                    backgroundColor: position === p.value ? '#16A34A' : '#F9FAFB',
                    border: position === p.value ? '2px solid #16A34A' : '2px solid #E5E7EB',
                  }}
                  className="rounded-xl py-2 px-3 text-center transition-all"
                >
                  <p className={`font-bold text-xs ${position === p.value ? 'text-white' : 'text-gray-700'}`}>
                    {p.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Start Number</label>
              <input
                type="number"
                min="1"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 outline-none text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Font Size</label>
              <input
                type="number"
                min="8"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 outline-none text-gray-900 font-medium"
              />
            </div>
          </div>
        </div>

        {status === 'processing' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Adding page numbers...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Page Numbers Added!</p>
            </div>
            <button
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'numbered.pdf'; a.click() }}
              style={{ backgroundColor: '#16A34A' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={() => { setFile(null); setStatus('idle'); setResult(null) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Add Numbers to Another File
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
            onClick={handleAdd}
            disabled={!file || status === 'processing'}
            style={{ backgroundColor: file ? '#16A34A' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'processing' ? 'Adding...' : 'Add Page Numbers'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}