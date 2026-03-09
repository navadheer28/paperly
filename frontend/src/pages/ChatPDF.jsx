import { useState, useRef, useEffect } from 'react'
import { Upload, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { ocrPDF, chatWithPDF } from '../services/api'

export default function ChatPDF() {
  const [file, setFile] = useState(null)
  const [pdfText, setPdfText] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle')
  const [extracting, setExtracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFile = async (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setExtracting(true)
      setMessages([])
      setPdfText('')
      try {
        const res = await ocrPDF(f)
        setPdfText(res.data.text)
        setExtracting(false)
        setStatus('ready')
        setMessages([{
          role: 'assistant',
          content: `Your PDF is ready! I have read "${f.name}" and I am ready to answer your questions.`
        }])
      } catch (err) {
        setExtracting(false)
        setStatus('error')
      }
    } else {
      alert('Please upload a PDF file!')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !pdfText) return
    const question = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setStatus('thinking')
    try {
      const res = await chatWithPDF(question, pdfText.substring(0, 2000))
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }])
      setStatus('ready')
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }])
      setStatus('ready')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
          <div style={{ backgroundColor: '#EDE9FE' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-purple-600">AI</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Chat with PDF</h1>
          <p className="text-gray-500 text-lg">Upload a PDF and ask anything about it</p>
        </div>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: isDragging ? '2.5px dashed #7C3AED' : '2.5px dashed #D1D5DB',
              backgroundColor: isDragging ? '#F5F3FF' : '#FFFFFF',
            }}
            className="rounded-3xl p-16 text-center cursor-pointer transition-all"
          >
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
        ) : (
          <div>
            <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: '#EDE9FE' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setPdfText(''); setMessages([]); setStatus('idle') }}
                className="text-sm text-red-400 hover:text-red-600 underline"
              >
                Remove
              </button>
            </div>

            {extracting && (
              <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="font-semibold text-gray-700">Reading your PDF...</p>
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm">Conversation</p>
                </div>
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        style={{
                          backgroundColor: msg.role === 'user' ? '#7C3AED' : '#F3F4F6',
                          maxWidth: '80%'
                        }}
                        className="rounded-2xl px-4 py-3"
                      >
                        <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {status === 'thinking' && (
                    <div className="flex justify-start">
                      <div style={{ backgroundColor: '#F3F4F6' }} className="rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}

            {status !== 'idle' && status !== 'error' && !extracting && (
              <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ask anything about your PDF..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={status === 'thinking'}
                  className="flex-1 outline-none text-gray-900 text-sm font-medium placeholder-gray-400 bg-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || status === 'thinking'}
                  style={{ backgroundColor: input.trim() ? '#7C3AED' : '#E5E7EB' }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="font-bold text-red-600">Could not read PDF. Please try again!</p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}