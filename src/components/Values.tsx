import { Award, Users, Shield, Lightbulb, Star, TrendingUp } from 'lucide-react';

const values = [
  { title: 'Excelencia en Calidad', icon: Award },
  { title: 'Enfoque en el Cliente', icon: Users },
  { title: 'Integridad', icon: Shield },
  { title: 'Innovación', icon: Lightbulb },
  { title: 'Experiencia', icon: Star },
  { title: 'Crecimiento Sostenible', icon: TrendingUp },
];

export default function Values() {
  return (
    <section id="valores" className="py-24 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-white text-center mb-16">
          Nuestros <span className="text-red-500">Valores</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-slate-800 hover:bg-red-500 p-6 rounded-xl transition-colors duration-300 text-center group"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-red-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {value.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
