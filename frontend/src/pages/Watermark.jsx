import { useState } from 'react'
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { watermarkPDF } from '../services/api'

export default function Watermark() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [text, setText] = useState('')
  const [opacity, setOpacity] = useState(30)
  const [position, setPosition] = useState('diagonal')
  const [color, setColor] = useState('gray')

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f); setStatus('idle'); setResult(null)
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const handleWatermark = async () => {
    if (!file || !text.trim()) return alert('Please upload a file and enter watermark text!')
    setStatus('processing')
    try {
      const res = await watermarkPDF(file, text, opacity, position, color)
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
    { value: 'diagonal', label: 'Diagonal' },
    { value: 'center', label: 'Center' },
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
  ]

  const colors = [
    { value: 'gray', label: 'Gray', hex: '#9CA3AF' },
    { value: 'red', label: 'Red', hex: '#EF4444' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'green', label: 'Green', hex: '#22C55E' },
    { value: 'orange', label: 'Orange', hex: '#F97316' },
  ]

  const colorHex = colors.find(c => c.value === color)?.hex || '#9CA3AF'

  const getWatermarkStyle = () => {
    const base = {
      position: 'absolute',
      color: colorHex,
      opacity: opacity / 100,
      fontWeight: 'bold',
      fontSize: '18px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      userSelect: 'none',
    }
    if (position === 'diagonal') return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-35deg)', fontSize: '16px' }
    if (position === 'center') return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    if (position === 'top') return { ...base, top: '12px', left: '50%', transform: 'translateX(-50%)' }
    if (position === 'bottom') return { ...base, bottom: '12px', left: '50%', transform: 'translateX(-50%)' }
    return base
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#EDE9FE' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-purple-600">W</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Watermark PDF</h1>
          <p className="text-gray-500 text-lg">Add a professional watermark to your PDF</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border: isDragging ? '2.5px dashed #7C3AED' : file ? '2.5px dashed #22C55E' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#F5F3FF' : file ? '#F0FDF4' : '#FFFFFF',
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
              <div style={{ backgroundColor: '#7C3AED' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <p className="font-bold text-gray-900 text-lg mb-1">Drop your PDF here</p>
              <p className="text-gray-400 text-sm">
                or{' '}
                <label className="text-purple-500 font-semibold underline cursor-pointer">
                  browse files
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </label>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 space-y-5">
          <p className="font-bold text-gray-900">Watermark Settings</p>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Watermark Text</label>
            <input
              type="text"
              placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none text-gray-900 font-medium"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Color</label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  style={{
                    backgroundColor: c.hex,
                    border: color === c.value ? '3px solid #1F2937' : '3px solid transparent',
                  }}
                  className="w-10 h-10 rounded-full transition-all hover:scale-110"
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Position</label>
            <div className="grid grid-cols-4 gap-2">
              {positions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  style={{
                    backgroundColor: position === p.value ? '#7C3AED' : '#F9FAFB',
                    border: position === p.value ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                  }}
                  className="rounded-xl py-2 text-center transition-all"
                >
                  <p className={`font-bold text-xs ${position === p.value ? 'text-white' : 'text-gray-700'}`}>
                    {p.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-2 block">Opacity: {opacity}%</label>
            <input
              type="range"
              min="10"
              max="90"
              value={opacity}
              onChange={(e) => setOpacity(e.target.value)}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Light</span>
              <span>Strong</span>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        {text.trim() && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <p className="font-bold text-gray-900 mb-3">Live Preview</p>
            <div
              className="relative rounded-xl overflow-hidden mx-auto"
              style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
              }}
            >
              {/* Fake page lines */}
              <div className="absolute inset-0 p-6 space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: `${70 + Math.random() * 25}%` }} />
                ))}
              </div>
              {/* Watermark */}
              <div style={getWatermarkStyle()}>
                {text}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">This is an approximate preview</p>
          </div>
        )}

        {status === 'processing' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Adding watermark...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Watermark Added!</p>
            </div>
            <button
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'watermarked.pdf'; a.click() }}
              style={{ backgroundColor: '#7C3AED' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Watermarked PDF
            </button>
            <button
              onClick={() => { setStatus('idle'); setResult(null) }}
              style={{ border: '2px solid #7C3AED' }}
              className="w-full py-3 rounded-xl text-purple-600 font-bold text-sm mt-2 hover:bg-purple-50 transition-all"
            >
              Try Different Settings
            </button>
            <button
              onClick={() => { setFile(null); setStatus('idle'); setResult(null) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Watermark Another File
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-600">Something went wrong! Please try again.</p>
            </div>
            <button onClick={() => setStatus('idle')} className="text-sm text-purple-500 font-semibold hover:underline">Try Again</button>
          </div>
        )}

        {status !== 'done' && (
          <button
            onClick={handleWatermark}
            disabled={!file || !text.trim() || status === 'processing'}
            style={{ backgroundColor: file && text.trim() ? '#7C3AED' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'processing' ? 'Adding Watermark...' : 'Add Watermark'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}