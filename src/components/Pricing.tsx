import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$499',
    period: '/mo',
    features: ['Core automation', 'Standard analytics', 'Email support'],
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$999',
    period: '/mo',
    features: ['Full automation suite', 'Advanced analytics', '24/7 support'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Custom workflows', 'Dedicated engineer', 'SLA guaranteed'],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-[#0F0F1A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C4EFF] to-[#FF6B81]">Plan</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-[#1E1E2A] rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                tier.highlight
                  ? 'border-2 border-[#8C4EFF] shadow-2xl shadow-[#8C4EFF]/20'
                  : 'border border-white/10 hover:border-[#8C4EFF]/50'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8C4EFF] to-[#FF6B81] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">{tier.name}</h3>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  {tier.period && <span className="text-[#C9C9D1] mb-2">{tier.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#8C4EFF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#C9C9D1]">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center font-semibold px-6 py-3 rounded-lg transition-all duration-200 ${
                  tier.highlight
                    ? 'bg-gradient-to-r from-[#8C4EFF] to-[#FF6B81] hover:shadow-lg hover:shadow-[#8C4EFF]/50 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Select Plan
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
