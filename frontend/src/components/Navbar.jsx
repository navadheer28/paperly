import { useState, useRef, useEffect } from 'react'
import { Menu, X, FileText, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const toolsMenu = [
  {
    category: 'Organize PDF',
    color: '#DBEAFE',
    iconColor: '#2563EB',
    tools: [
      { name: 'Merge PDF', path: '/merge' },
      { name: 'Split PDF', path: '/split' },
      { name: 'Rotate PDF', path: '/rotate' },
    ]
  },
  {
    category: 'Optimize PDF',
    color: '#DCFCE7',
    iconColor: '#16A34A',
    tools: [
      { name: 'Compress PDF', path: '/compress' },
      { name: 'Page Numbers', path: '/page-numbers' },
    ]
  },
  {
    category: 'Convert PDF',
    color: '#FEF3C7',
    iconColor: '#D97706',
    tools: [
      { name: 'PDF to Word', path: '/pdf-to-word' },
      { name: 'PDF to Excel', path: '/pdf-to-excel' },
      { name: 'PDF to PPT', path: '/pdf-to-ppt' },
      { name: 'PDF to JPG', path: '/pdf-to-jpg' },
      { name: 'Word to PDF', path: '/word-to-pdf' },
      { name: 'JPG to PDF', path: '/jpg-to-pdf' },
    ]
  },
  {
    category: 'Edit PDF',
    color: '#F3E8FF',
    iconColor: '#7C3AED',
    tools: [
      { name: 'Watermark', path: '/watermark' },
    ]
  },
  {
    category: 'PDF Security',
    color: '#FEE2E2',
    iconColor: '#DC2626',
    tools: [
      { name: 'Protect PDF', path: '/protect' },
      { name: 'Unlock PDF', path: '/unlock' },
    ]
  },
  {
    category: 'PDF Intelligence',
    color: '#FEF9C3',
    iconColor: '#CA8A04',
    tools: [
      { name: 'OCR PDF', path: '/ocr' },
      { name: 'Chat with PDF', path: '/chat-pdf' },
      { name: 'Summarize PDF', path: '/summarize' },
      { name: 'AI Create PDF', path: '/create-pdf' },
    ]
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToolClick = (path) => {
    navigate(path)
    setShowDropdown(false)
    setIsOpen(false)
    setMobileToolsOpen(false)
  }

  return (
    <nav style={{ backgroundColor: '#FAFAF8' }} className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div style={{ backgroundColor: '#EA580C' }} className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900">Paperly</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">

          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold"
            >
              Tools
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div
                style={{ backgroundColor: '#FFFFFF', top: 'calc(100% + 16px)' }}
                className="absolute left-1/2 -translate-x-1/2 w-[700px] rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-3 gap-6"
              >
                {/* Arrow pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />

                {toolsMenu.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        style={{ backgroundColor: cat.color }}
                        className="w-2 h-2 rounded-full"
                      />
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        {cat.category}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {cat.tools.map((tool) => (
                        <button
                          key={tool.path}
                          onClick={() => handleToolClick(tool.path)}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="col-span-3 border-t border-gray-100 pt-4 mt-2">
                  <button
                    onClick={() => { navigate('/'); setShowDropdown(false); setTimeout(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
                    className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    View all tools →
                  </button>
                </div>
              </div>
            )}
          </div>

          <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold">How it works</a>
          <a href="#pricing" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold">Pricing</a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors">
            Sign in
          </button>
          <button
            style={{ backgroundColor: '#EA580C' }}
            className="px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all shadow-sm"
          >
            Get Started Free
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{ backgroundColor: '#FAFAF8' }} className="md:hidden border-t border-gray-200 px-6 py-4 flex flex-col gap-2 max-h-screen overflow-y-auto">

          {/* Mobile Tools Accordion */}
          <button
            onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
            className="flex items-center justify-between text-gray-600 hover:text-black text-sm font-semibold py-2"
          >
            Tools
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileToolsOpen && (
            <div className="pl-3 space-y-4 mb-2">
              {toolsMenu.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{cat.category}</p>
                  {cat.tools.map((tool) => (
                    <button
                      key={tool.path}
                      onClick={() => handleToolClick(tool.path)}
                      className="w-full text-left py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          <a href="#how-it-works" className="text-gray-600 hover:text-black text-sm font-semibold py-2">How it works</a>
          <a href="#pricing" className="text-gray-600 hover:text-black text-sm font-semibold py-2">Pricing</a>
          <button
            style={{ backgroundColor: '#EA580C' }}
            className="px-5 py-3 text-sm font-bold text-white rounded-xl mt-2"
          >
            Get Started Free
          </button>
        </div>
      )}
    </nav>
  )
}