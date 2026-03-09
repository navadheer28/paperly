import { useState, useEffect } from 'react'
import { Upload, Download, Plus, X, CheckCircle, AlertCircle, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { mergePDFs } from '../services/api'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

async function generateThumbnail(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 0.4 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
  return canvas.toDataURL()
}

export default function Merge() {
  const [files, setFiles] = useState([])
  const [thumbnails, setThumbnails] = useState({})
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = async (newFiles) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    if (pdfs.length === 0) return alert('Please upload PDF files only!')

    const startIndex = files.length
    setFiles(prev => [...prev, ...pdfs])
    setStatus('idle')
    setResult(null)

    for (let i = 0; i < pdfs.length; i++) {
      const key = startIndex + i
      try {
        const thumb = await generateThumbnail(pdfs[i])
        setThumbnails(prev => ({ ...prev, [key]: thumb }))
      } catch (e) {
        setThumbnails(prev => ({ ...prev, [key]: null }))
      }
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setThumbnails(prev => {
      const updated = {}
      Object.keys(prev).forEach(k => {
        const ki = parseInt(k)
        if (ki < index) updated[ki] = prev[ki]
        else if (ki > index) updated[ki - 1] = prev[ki]
      })
      return updated
    })
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(files)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    setFiles(reordered)

    const thumbKeys = Object.keys(thumbnails)
    const thumbArray = files.map((_, i) => thumbnails[i])
    const [removedThumb] = thumbArray.splice(result.source.index, 1)
    thumbArray.splice(result.destination.index, 0, removedThumb)
    const newThumbs = {}
    thumbArray.forEach((t, i) => { newThumbs[i] = t })
    setThumbnails(newThumbs)
  }

  const handleMerge = async () => {
    if (files.length < 2) return alert('Please upload at least 2 PDF files!')
    setStatus('merging')
    try {
      const res = await mergePDFs(files)
      setResult(res.data)
      setStatus('done')
    } catch (err) {
      setStatus('error')
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#EDE9FE' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Merge PDF</h1>
          <p className="text-gray-500 text-lg">Combine multiple PDFs — drag to reorder</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
          style={{
            border: isDragging ? '2.5px dashed #7C3AED' : '2.5px dashed #D1D5DB',
            backgroundColor: isDragging ? '#F5F3FF' : '#FFFFFF',
          }}
          className="rounded-3xl p-10 text-center cursor-pointer transition-all mb-6"
        >
          <div style={{ backgroundColor: '#7C3AED' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <p className="font-bold text-gray-900 text-lg mb-1">Drop your PDFs here</p>
          <p className="text-gray-400 text-sm">
            or{' '}
            <label className="text-purple-500 font-semibold underline cursor-pointer">
              browse files
              <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </label>
            {' '}— select multiple files
          </p>
        </div>

        {files.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-gray-900">Files to merge ({files.length})</p>
              <p className="text-gray-400 text-sm">Drag to reorder</p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="files" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-4 overflow-x-auto pb-2"
                  >
                    {files.map((file, index) => (
                      <Draggable key={`file-${index}`} draggableId={`file-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                            className="flex-shrink-0 w-36"
                          >
                            <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-purple-300 transition-all">
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between px-2 py-1 bg-gray-100 cursor-grab active:cursor-grabbing"
                              >
                                <div className="flex items-center gap-1">
                                  <GripVertical className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs font-bold text-gray-500">{index + 1}</span>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 rounded transition-all"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="h-44 flex items-center justify-center bg-white p-1">
                                {thumbnails[index] ? (
                                  <img
                                    src={thumbnails[index]}
                                    alt={`Page 1 of ${file.name}`}
                                    className="max-h-full max-w-full object-contain rounded"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-full">
                                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-2" />
                                    <p className="text-xs text-gray-400">Loading...</p>
                                  </div>
                                )}
                              </div>

                              <div className="px-2 py-2">
                                <p className="text-xs font-semibold text-gray-700 truncate">{file.name}</p>
                                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    <div className="flex-shrink-0 w-36">
                      <label className="flex flex-col items-center justify-center h-full min-h-56 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-purple-300 hover:text-purple-500 cursor-pointer transition-all">
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Add more</span>
                        <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                      </label>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {status === 'merging' && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-semibold text-gray-700">Merging your PDFs...</p>
            </div>
          </div>
        )}

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Merged Successfully!</p>
            </div>
            <button
              onClick={() => { const a = document.createElement('a'); a.href = result.downloadUrl; a.download = 'merged.pdf'; a.click() }}
              style={{ backgroundColor: '#7C3AED' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Merged PDF
            </button>
            <button
              onClick={() => { setFiles([]); setThumbnails({}); setStatus('idle'); setResult(null) }}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Merge Other Files
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
            onClick={handleMerge}
            disabled={files.length < 2 || status === 'merging'}
            style={{ backgroundColor: files.length >= 2 ? '#7C3AED' : '#E5E7EB' }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 disabled:cursor-not-allowed"
          >
            {status === 'merging' ? 'Merging...' : `Merge ${files.length} PDFs`}
          </button>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}