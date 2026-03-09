const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    avatar: 'SJ',
    color: 'bg-blue-100 text-blue-600',
    text: 'Paperly saved me so much time! I compress and convert PDFs daily. The AI PDF creator is absolutely mind-blowing — I just type a topic and get a full document!',
  },
  {
    name: 'Rahul Sharma',
    role: 'College Student',
    avatar: 'RS',
    color: 'bg-green-100 text-green-600',
    text: 'Finally a free PDF tool that actually works without watermarks or hidden charges. The OCR feature helped me extract text from my scanned notes perfectly!',
  },
  {
    name: 'Emily Chen',
    role: 'Freelance Designer',
    avatar: 'EC',
    color: 'bg-purple-100 text-purple-600',
    text: 'I love how clean and simple the interface is. No clutter, no confusion. Just drag, drop and done. Way better than other PDF tools I have tried before.',
  },
  {
    name: 'Mohammed Al-Rashid',
    role: 'Business Owner',
    avatar: 'MA',
    color: 'bg-orange-100 text-orange-600',
    text: 'The batch processing feature is a lifesaver. I process hundreds of invoices every month. The share link feature makes sending files to clients so easy!',
  },
  {
    name: 'Priya Patel',
    role: 'HR Professional',
    avatar: 'PP',
    color: 'bg-pink-100 text-pink-600',
    text: 'The PDF signing feature is so smooth. I sign and send contracts in seconds. The auto-delete privacy feature gives me confidence to upload sensitive documents.',
  },
  {
    name: 'James Wilson',
    role: 'Software Developer',
    avatar: 'JW',
    color: 'bg-yellow-100 text-yellow-600',
    text: 'As a developer I appreciate the clean UI and fast processing. The Chat with PDF feature powered by Claude AI is genuinely impressive and super useful!',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Loved by{' '}
            <span style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: '400' }}>
              thousands
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Join over 50,000 users who trust Paperly for their daily PDF needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-3xl p-7 border border-gray-100 hover:shadow-md transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-semibold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-black text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}