import { useState } from 'react'
import { Upload, Download, CheckCircle, AlertCircle, Image, X, Plus } from 'lucide-react'
import { jpgToPdf } from '../services/api'

export default function JpgToPdf() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (newFiles) => {
    const images = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    if (images.length === 0) return alert('Please upload image files only!')
    setFiles(prev => [...prev, ...images])
    setStatus('idle')
    setResult(null)
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    setStatus('converting')
    try {
      const res = await jpgToPdf(files)
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

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#FEF3C7' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">JPG to PDF</h1>
          <p className="text-gray-500 text-lg">Convert JPG images into a single PDF document</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
          style={{
            border: isDragging ? '2.5px dashed #D97706' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#FFFBEB' : '#FFFFFF',
          }}
          className="rounded-3xl p-12 text-center cursor-pointer transition-all mb-6"
        >
          <div style={{ backgroundColor: '#D97706' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-gray-900 text-lg mb-1">Drop your images here</p>
          <p className="text-gray-400 text-sm">
            or{' '}
            <label className="text-yellow-600 font-semibold underline cursor-pointer">
              browse files
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>
            {' '}— JPG, PNG, WebP supported
          </p>
        </div>

        {files.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-900">Images ({files.length})</p>
              <p className="text-gray-400 text-sm">Order matters — top to bottom</p>
            </div>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div style={{ backgroundColor: '#FEF3C7' }} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{file.name}</p>
                    <p className="text-gray-400 text-xs">{formatSize(file.size)}</p>
                  </div>
                  <button onClick={() => removeFile(index)} className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-yellow-300 hover:text-yellow-600 cursor-pointer transition-all text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add more images
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>
          </div>
        )}

        {status === 'converting' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Converting images to PDF...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Converted Successfully!</p>
            </div>
            <button
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'converted.pdf'; a.click() }}
              style={{ backgroundColor: '#D97706' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={() => { setFiles([]); setStatus('idle'); setResult(null) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Convert More Images
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
            onClick={handleConvert}
            disabled={files.length === 0 || status === 'converting'}
            style={{ backgroundColor: files.length > 0 ? '#D97706' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'converting' ? 'Converting...' : `Convert ${files.length} Image${files.length !== 1 ? 's' : ''} to PDF`}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}