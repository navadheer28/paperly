import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    desc: 'Perfect for occasional use',
    color: 'bg-white',
    buttonStyle: 'bg-gray-100 text-black hover:bg-gray-200',
    features: [
      'All basic PDF tools',
      'Up to 10MB file size',
      '5 tasks per day',
      'Standard processing speed',
      'Files deleted after 1 hour',
      'Ad supported',
    ],
  },
  {
    name: 'Pro',
    price: '299',
    period: '/month',
    desc: 'For power users & professionals',
    color: 'bg-black',
    popular: true,
    buttonStyle: 'bg-white text-black hover:bg-gray-100',
    features: [
      'All PDF tools unlocked',
      'Up to 500MB file size',
      'Unlimited tasks',
      'Priority processing speed',
      'Files deleted after 24 hours',
      'No ads',
      'AI PDF Creator',
      'Chat with PDF',
      'Batch processing',
      'Share links',
    ],
  },
  {
    name: 'Business',
    price: '799',
    period: '/month',
    desc: 'For teams & organizations',
    color: 'bg-white',
    buttonStyle: 'bg-black text-white hover:bg-gray-800',
    features: [
      'Everything in Pro',
      'Unlimited file size',
      'Team collaboration',
      'API access',
      'Priority support',
      'Custom branding',
      'Advanced security',
      'Usage analytics',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Simple,{' '}
            <span style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: '400' }}>
              transparent
            </span>
            {' '}pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start for free. Upgrade when you need more power.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${plan.color} rounded-3xl p-8 border ${plan.popular ? 'border-transparent scale-105 shadow-2xl' : 'border-gray-100'} relative`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </span>
              )}

              {/* Plan name */}
              <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-black'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.desc}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-8">
                <span className={`text-sm font-medium ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
                <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-black'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm mb-2 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Button */}
              <button className={`w-full py-3 rounded-full font-medium text-sm transition-colors mb-8 ${plan.buttonStyle}`}>
                {plan.price === '0' ? 'Get Started Free' : 'Start Free Trial'}
              </button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-white/20' : 'bg-gray-100'}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-black'}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}