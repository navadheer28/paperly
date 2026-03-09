import { useState } from 'react'
import { Upload, ArrowRight, Shield, Zap, Globe, FileText, Scissors, RotateCw, Sparkles, Lock, FileImage } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const quickTools = [
  { name: 'Compress', icon: FileText, color: '#E8F5E9', iconColor: '#2E7D32', path: '/compress' },
  { name: 'Merge', icon: FileText, color: '#E3F2FD', iconColor: '#1565C0', path: '/merge' },
  { name: 'Split', icon: Scissors, color: '#FFF3E0', iconColor: '#E65100', path: '/split' },
  { name: 'Convert', icon: RotateCw, color: '#F3E5F5', iconColor: '#6A1B9A', path: '/pdf-to-word' },
  { name: 'OCR', icon: Sparkles, color: '#FFF8E1', iconColor: '#F57F17', path: '/ocr' },
  { name: 'Protect', icon: Lock, color: '#FCE4EC', iconColor: '#880E4F', path: '/protect' },
  { name: 'JPG→PDF', icon: FileImage, color: '#E0F7FA', iconColor: '#006064', path: '/jpg-to-pdf' },
  { name: 'Sign', icon: FileText, color: '#E8EAF6', iconColor: '#283593', path: null },
]

export default function Hero() {
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredTool, setHoveredTool] = useState(null)
  const navigate = useNavigate()

  const handleUpload = () => {
    document.getElementById('hero-file-input').click()
  }

  const handleSeeAllTools = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{ backgroundColor: '#FAFAF8' }} className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">

      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: '350px', height: '350px', borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        backgroundColor: '#FEF3C7', opacity: 0.6, zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '2%',
        width: '250px', height: '250px', borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%',
        backgroundColor: '#DBEAFE', opacity: 0.5, zIndex: 0
      }} />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* Top badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-gray-900 shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-gray-900">30+ Free PDF Tools · Powered by Claude AI</span>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center mb-6">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-none mb-4 tracking-tight">
            Your PDFs,
          </h1>
          <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight" style={{
            fontFamily: 'Instrument Serif, serif',
            fontStyle: 'italic',
            fontWeight: '700',
            color: '#EA580C'
          }}>
            simplified.
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-center text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Everything you need to work with PDFs — compress, convert, merge, split, sign and more.
          <span className="font-semibold text-gray-700"> No sign up. Always free.</span>
        </p>

        {/* CTA buttons */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          <button
            onClick={handleUpload}
            style={{ backgroundColor: '#EA580C' }}
            className="px-8 py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload PDF
          </button>
          <button
            onClick={handleSeeAllTools}
            className="px-8 py-4 rounded-2xl border-2 border-gray-900 text-gray-900 font-bold text-lg hover:bg-gray-900 hover:text-white transition-all flex items-center gap-2">
            See all Tools
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tool pills grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {quickTools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => tool.path && navigate(tool.path)}
              onMouseEnter={() => setHoveredTool(tool.name)}
              onMouseLeave={() => setHoveredTool(null)}
              style={{
                backgroundColor: hoveredTool === tool.name ? tool.color : '#FFFFFF',
                border: `2px solid ${hoveredTool === tool.name ? tool.iconColor : '#E5E7EB'}`,
                transform: hoveredTool === tool.name ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 0.2s ease',
                cursor: tool.path ? 'pointer' : 'not-allowed',
                opacity: tool.path ? 1 : 0.5,
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl shadow-sm"
            >
              <div style={{ backgroundColor: tool.color, borderRadius: '8px', padding: '4px' }}>
                <tool.icon style={{ color: tool.iconColor }} className="w-4 h-4" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Upload drop zone */}
        <div className="max-w-2xl mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
            style={{
              border: `2.5px dashed ${isDragging ? '#EA580C' : '#D1D5DB'}`,
              backgroundColor: isDragging ? '#FFF7ED' : '#FFFFFF',
              transition: 'all 0.2s ease',
            }}
            className="rounded-3xl p-12 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50"
          >
            <div style={{ backgroundColor: '#EA580C' }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">Drop your file here</p>
            <p className="text-gray-400 mb-1">or{' '}
              <label className="text-orange-500 font-semibold underline cursor-pointer">
                browse files
                <input
                  id="hero-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="hidden"
                  onChange={(e) => { if (e.target.files[0]) navigate('/compress') }}
                />
              </label>
            </p>
            <p className="text-gray-300 text-sm">PDF, DOC, JPG, PNG up to 100MB</p>
          </div>

          {/* Trust row */}
          <div className="flex justify-center gap-8 mt-6 flex-wrap">
            {[
              { icon: Shield, text: 'Files deleted in 1hr' },
              { icon: Zap, text: 'Instant processing' },
              { icon: Globe, text: '50,000+ users' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}