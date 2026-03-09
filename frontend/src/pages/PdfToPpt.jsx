import { useState } from 'react'
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { pdfToPpt } from '../services/api'

export default function PdfToPpt() {
  const [file, setFile] = useState(null)
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

  const handleConvert = async () => {
    if (!file) return
    setStatus('converting')
    try {
      const res = await pdfToPpt(file)
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
            <span className="text-2xl font-black text-orange-500">PPT</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">PDF to PowerPoint</h1>
          <p className="text-gray-500 text-lg">Convert your PDF into an editable PowerPoint presentation</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border: isDragging ? '2.5px dashed #EA580C' : file ? '2.5px dashed #22C55E' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#FFF7ED' : file ? '#F0FDF4' : '#FFFFFF',
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

        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
          <p className="font-bold text-gray-900 mb-2">What you get</p>
          <div className="space-y-2">
            {[
              'Each PDF page becomes a slide',
              'Images preserved as slide backgrounds',
              'Ready to edit in PowerPoint',
              'PPTX format supported by all versions',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div style={{ backgroundColor: '#FEF3C7' }} className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-gray-600 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {status === 'converting' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="font-semibold text-gray-700">Converting PDF to PowerPoint...</p>
                <p className="text-gray-400 text-sm mt-1">Each page becomes a slide</p>
              </div>
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
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'presentation.pptx'; a.click() }}
              style={{ backgroundColor: '#EA580C' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download PowerPoint
            </button>
            <button
              onClick={() => { setFile(null); setStatus('idle'); setResult(null) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Convert Another File
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
            disabled={!file || status === 'converting'}
            style={{ backgroundColor: file ? '#EA580C' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'converting' ? 'Converting...' : 'Convert to PowerPoint'}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}