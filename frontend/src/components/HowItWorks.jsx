import { Upload, Sliders, Download } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload your file',
    desc: 'Drag and drop your PDF or any document. We support PDF, Word, Excel, JPG and more.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    step: '02',
    icon: Sliders,
    title: 'Choose your tool',
    desc: 'Pick from 30+ tools. Compress, convert, merge, split, sign or let AI create for you.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    step: '03',
    icon: Download,
    title: 'Download instantly',
    desc: 'Your file is processed in seconds. Download it or share via link — files auto-delete in 1 hour.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Simple as{' '}
            <span style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: '400' }}>
              one, two, three
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No learning curve. No sign up. Just upload and get your file back in seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gray-200 z-0" style={{ width: '50%', left: '75%' }} />
              )}

              <div className="bg-gray-50 rounded-3xl p-8 relative z-10">
                {/* Step number */}
                <span className="text-6xl font-bold text-gray-100 absolute top-4 right-6">
                  {step.step}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}