import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'Transformaron nuestra operación interna en un motor de alto rendimiento. La combinación de equipo + IA funciona.',
    author: 'Javier Martínez',
    role: 'COO – AutoCorp',
  },
  {
    quote: 'Escalar en múltiples sitios habría sido imposible sin su combinación de talento + plataforma.',
    author: 'Lisa Chen',
    role: 'VP Operaciones – GlobalLogistics',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-[#1E1E22]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Lo que Dicen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B3F] to-[#00C1FF]">Nuestros Clientes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-[#0D0D0F] p-10 rounded-2xl border border-white/10 hover:border-[#FF6B3F]/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B3F]/5 to-transparent rounded-2xl"></div>

              <div className="relative z-10">
                <Quote className="w-14 h-14 text-[#FF6B3F] mb-6" />
                <p className="text-[#C4C4C8] text-xl leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="font-bold text-white text-lg">{testimonial.author}</p>
                  <p className="text-[#C4C4C8] text-sm mt-1">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
