import { useNavigate } from 'react-router-dom'
import { 
  FileDown, FilePlus, FileMinus, FileText, 
  FileSpreadsheet, FileImage, Lock, Unlock,
  RotateCw, Crop, Pen, Stamp, Search,
  Languages, Shield, GitCompare, Scissors,
  FileOutput, Wrench, Hash, Scan, Eraser, Sparkles
} from 'lucide-react'

const toolCategories = [
  {
    name: 'Organize PDF',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    tools: [
      { name: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: FilePlus, path: '/merge' },
      { name: 'Split PDF', desc: 'Split PDF into separate files', icon: FileMinus, path: '/split' },
      { name: 'Organize PDF', desc: 'Sort, delete or add pages', icon: FileText, path: null },
      { name: 'Rotate PDF', desc: 'Rotate pages in any direction', icon: RotateCw, path: '/rotate' },
      { name: 'Crop PDF', desc: 'Crop margins or specific areas', icon: Crop, path: null },
      { name: 'Repair PDF', desc: 'Fix damaged PDF files', icon: Wrench, path: null },
    ]
  },
  {
    name: 'Optimize PDF',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    tools: [
      { name: 'Compress PDF', desc: 'Reduce file size, keep quality', icon: FileDown, path: '/compress' },
      { name: 'Page Numbers', desc: 'Add page numbers to PDF', icon: Hash, path: '/page-numbers' },
    ]
  },
  {
    name: 'Convert PDF',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
    tools: [
      { name: 'PDF to Word', desc: 'Convert PDF to editable Word', icon: FileText, path: '/pdf-to-word' },
      { name: 'PDF to Excel', desc: 'Extract data into spreadsheets', icon: FileSpreadsheet, path: '/pdf-to-excel' },
      { name: 'PDF to PPT', desc: 'Convert PDF to PowerPoint', icon: FileOutput, path: '/pdf-to-ppt' },
      { name: 'PDF to JPG', desc: 'Convert pages to images', icon: FileImage, path: '/pdf-to-jpg' },
      { name: 'Word to PDF', desc: 'Convert Word docs to PDF', icon: FileText, path: '/word-to-pdf' },
      { name: 'Excel to PDF', desc: 'Convert spreadsheets to PDF', icon: FileSpreadsheet, path: null },
      { name: 'JPG to PDF', desc: 'Convert images to PDF', icon: FileImage, path: '/jpg-to-pdf' },
      { name: 'HTML to PDF', desc: 'Convert webpages to PDF', icon: FileOutput, path: null },
    ]
  },
  {
    name: 'Edit PDF',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    tools: [
      { name: 'Edit PDF', desc: 'Add text, images and shapes', icon: Pen, path: null },
      { name: 'Watermark', desc: 'Stamp text or image on PDF', icon: Stamp, path: '/watermark' },
      { name: 'Sign PDF', desc: 'Sign or request signatures', icon: Pen, path: null },
      { name: 'Redact PDF', desc: 'Permanently remove sensitive info', icon: Eraser, path: null },
      { name: 'Translate PDF', desc: 'AI-powered PDF translation', icon: Languages, path: null },
    ]
  },
  {
    name: 'PDF Security',
    color: 'bg-red-50',
    iconColor: 'text-red-600',
    tools: [
      { name: 'Unlock PDF', desc: 'Remove password protection', icon: Unlock, path: '/unlock' },
      { name: 'Protect PDF', desc: 'Add password to your PDF', icon: Lock, path: '/protect' },
    ]
  },
  {
    name: 'PDF Intelligence',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    tools: [
      { name: 'OCR PDF', desc: 'Extract text from scanned PDFs', icon: Scan, path: '/ocr' },
      { name: 'Compare PDF', desc: 'Spot changes between PDFs', icon: GitCompare, path: null },
      { name: 'AI Create PDF', desc: 'Generate PDF from a topic using AI', icon: Sparkles, path: '/create-pdf' },
      { name: 'Chat with PDF', desc: 'Ask questions about your PDF', icon: Search, path: '/chat-pdf' },
      { name: 'Summarize PDF', desc: 'Get a summary of your PDF', icon: FileText, path: '/summarize' },
    ]
  },
]

export default function Tools() {
  const navigate = useNavigate()

  return (
    <section id="tools" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Every PDF tool you'll{' '}
            <span style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: '400' }}>
              ever need
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From simple compression to AI-powered creation — all tools are free, fast and easy to use.
          </p>
        </div>

        <div className="space-y-12">
          {toolCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${category.color.replace('bg-', 'bg-').replace('-50', '-400')}`}></span>
                {category.name}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.tools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => tool.path ? navigate(tool.path) : null}
                    className={`bg-white rounded-2xl p-5 text-left transition-all border border-gray-100 group
                      ${tool.path 
                        ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                      }`}
                  >
                    <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center mb-3`}>
                      <tool.icon className={`w-5 h-5 ${category.iconColor}`} />
                    </div>
                    <p className="font-semibold text-black text-sm mb-1">{tool.name}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{tool.desc}</p>
                    {!tool.path && (
                      <span className="text-xs text-gray-300 font-medium mt-2 block">Coming soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}