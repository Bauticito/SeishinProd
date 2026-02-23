import { Gauge, TrendingUp, DollarSign } from 'lucide-react';

const benefits = [
  {
    icon: Gauge,
    title: '70% Faster Processes',
    text: 'Accelerate workflows and eliminate bottlenecks with intelligent automation.',
  },
  {
    icon: TrendingUp,
    title: '3× Productivity Boost',
    text: 'Empower your team with AI-enabled tools that scale performance.',
  },
  {
    icon: DollarSign,
    title: '50% Cost Reduction',
    text: 'Optimize operational costs while maintaining high-quality output.',
  },
];

export default function Benefits() {
  return (
    <section className="py-20 px-6 bg-[#0F0F1A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C4EFF] to-[#FF6B81]">Us</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="relative bg-[#1E1E2A] p-8 rounded-2xl border border-white/10 hover:border-[#8C4EFF]/50 transition-all duration-300 hover:scale-105 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#8C4EFF]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8C4EFF] to-[#FF6B81] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#8C4EFF]/30">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-[#C9C9D1] leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
