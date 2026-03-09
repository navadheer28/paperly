import { FileText, Twitter, Github, Linkedin, Heart } from 'lucide-react'

const footerLinks = [
  {
    title: 'Tools',
    links: [
      'Compress PDF', 'Merge PDF', 'Split PDF',
      'PDF to Word', 'PDF to Excel', 'OCR PDF',
      'Sign PDF', 'Protect PDF', 'AI Create PDF'
    ]
  },
  {
    title: 'Convert',
    links: [
      'PDF to JPG', 'JPG to PDF', 'Word to PDF',
      'Excel to PDF', 'PPT to PDF', 'HTML to PDF',
      'PDF to PPT', 'Scan to PDF'
    ]
  },
  {
    title: 'Company',
    links: [
      'About Us', 'Blog', 'Careers',
      'Press Kit', 'Contact Us'
    ]
  },
  {
    title: 'Legal',
    links: [
      'Privacy Policy', 'Terms of Service',
      'Cookie Policy', 'GDPR Compliance'
    ]
  },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold">Paperly</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The smartest PDF toolkit powered by AI. Free, fast and privacy-first.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 Paperly. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400 mx-1" /> for PDF lovers worldwide
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  )
}