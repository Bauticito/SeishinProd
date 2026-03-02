import { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { createContactMessage } from '@/services/odooService';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    empresa: '',
    mensaje: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await createContactMessage(formData);
      setStatus('success');
      setFormData({ nombre: '', correo: '', empresa: '', mensaje: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--blue-corporate)] to-[var(--accent-primary)]">Contacto</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            Solicita tu cotización y descubre cómo podemos ayudarte
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)]">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">Teléfono</p>
                    <a href="tel:4491155269" className="text-[var(--text-primary)] font-semibold hover:text-[var(--accent-primary)] transition-colors">
                      449 115 5269
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">Correo</p>
                    <a href="mailto:fabian.noel@seishin.com.mx" className="text-[var(--text-primary)] font-semibold hover:text-[var(--accent-primary)] transition-colors break-all">
                      fabian.noel@seishin.com.mx
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">Horario</p>
                    <p className="text-[var(--text-primary)] font-semibold">
                      Lunes a viernes<br />9:00 - 17:00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">Ubicaciones</p>
                    <p className="text-[var(--text-primary)] font-semibold">
                      Guanajuato<br />Aguascalientes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--blue-corporate)] to-[var(--accent-primary)] p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-3">Respuesta Operativa 24/7</h3>
              <p className="text-white/90 text-sm">
                Disponibilidad para iniciar operaciones en cualquier momento. Despliegue rápido de hasta 100 operadores en 10 días.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[var(--border-color)]">
            {status === 'success' ? (
              <div className="py-8 sm:py-12 text-center">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#f97316] mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                  Tu mensaje fue registrado. Te responderemos pronto.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-colors duration-200"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="correo" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-colors duration-200"
                      placeholder="tu@empresa.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-colors duration-200"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none transition-colors duration-200 resize-none"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-300">
                      {errorMsg || 'No se pudo enviar el mensaje. Intenta de nuevo.'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#f97316] hover:bg-[#ea580c] hover:shadow-lg hover:shadow-[#f97316]/50 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
