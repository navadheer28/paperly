import { useState, useRef, useEffect } from 'react'
import { Send, Download, CheckCircle } from 'lucide-react'
import { aiCreatePDF } from '../services/api'

export default function CreatePDF() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help you create a professional PDF document. What kind of document do you want to create? For example: a resume, report, letter, proposal, essay, or anything else!'
    }
  ])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('chatting')
  const [result, setResult] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setStatus('thinking')

    try {
      const res = await aiCreatePDF(newMessages)
      const aiReply = res.data.content

      if (newMessages.length >= 4) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Your document is ready! Click the button below to download it as a PDF.'
        }])
        setResult({ content: aiReply })
        setStatus('done')
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])
        setStatus('chatting')
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again!'
      }])
      setStatus('chatting')
    }
  }

  const handleDownload = async () => {
    if (!result) return
    try {
      const response = await fetch('http://localhost:5000/api/pdf/create-from-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: result.content })
      })
      const data = await response.json()
      if (data.downloadUrl) {
        const a = document.createElement('a')
        a.href = data.downloadUrl
        a.download = 'document.pdf'
        a.click()
      }
    } catch (err) {
      alert('Download failed! Please try again.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: 'Hi! I can help you create a professional PDF document. What kind of document do you want to create?'
    }])
    setStatus('chatting')
    setResult(null)
    setInput('')
  }

  return (
    <div style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div style={{ backgroundColor: '#DCFCE7' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-green-600">AI</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">AI PDF Creator</h1>
          <p className="text-gray-500 text-lg">Chat with AI to create any professional document</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <p className="font-bold text-gray-900 text-sm">AI Assistant</p>
            {result && (
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Start over
              </button>
            )}
          </div>

          <div className="p-4 space-y-4 min-h-64 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  style={{
                    backgroundColor: msg.role === 'user' ? '#16A34A' : '#F3F4F6',
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

          {status !== 'done' && (
            <div className="p-3 border-t border-gray-100 flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status === 'thinking'}
                className="flex-1 outline-none text-gray-900 text-sm font-medium placeholder-gray-400 bg-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || status === 'thinking'}
                style={{ backgroundColor: input.trim() ? '#16A34A' : '#E5E7EB' }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>

        {status === 'done' && result && (
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-bold text-green-600">Document Ready!</p>
            </div>
            <button
              onClick={handleDownload}
              style={{ backgroundColor: '#16A34A' }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Download className="w-5 h-5" />
              Download as PDF
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm mt-2 hover:border-gray-400 transition-all"
            >
              Create Another Document
            </button>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Your files are automatically deleted after 1 hour
        </p>

      </div>
    </div>
  )
}