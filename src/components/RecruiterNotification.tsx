import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, ArrowRight, Loader2, CheckCircle2, ChevronLeft, Sparkles, Zap, Users } from 'lucide-react';
import { createJobApplicant, getJobPositions, JobPosition } from '../services/odooService';
import {
  validateNombre,
  validateCorreo,
  validateTelefono,
  validateMensaje,
  filterTelefono,
} from '../lib/formValidation';
import { SwalError } from '../lib/swal';

type View = 'card' | 'form' | 'success';

const emptyForm = { nombre: '', correo: '', telefono: '', mensaje: '', jobId: '' };
const emptyErrors = { nombre: '', correo: '', telefono: '', mensaje: '' };

export default function RecruiterNotification() {
  const [visible, setVisible]           = useState(false);
  const [view, setView]                 = useState<View>('card');
  const [loading, setLoading]           = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [errors, setErrors]             = useState(emptyErrors);
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);

  useEffect(() => {
    getJobPositions()
      .then(setJobPositions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const show = () => {
      setVisible(false);
      setView('card');
      setForm(emptyForm);
      setErrors(emptyErrors);
      const timer = setTimeout(() => setVisible(true), 800);
      return timer;
    };

    let timer = show();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);
        timer = show();
      } else {
        setVisible(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const validateAll = () => {
    const newErrors = {
      nombre:   validateNombre(form.nombre),
      correo:   validateCorreo(form.correo),
      telefono: validateTelefono(form.telefono),
      mensaje:  validateMensaje(form.mensaje, false),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      await createJobApplicant({
        nombre:   form.nombre,
        correo:   form.correo,
        telefono: form.telefono,
        mensaje:  form.mensaje,
        jobId:    form.jobId ? Number(form.jobId) : undefined,
      });
      setView('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[RecruiterNotification] Error:', msg);
      SwalError('No se pudo enviar', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleField = (field: keyof typeof emptyErrors, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    const validators: Record<keyof typeof emptyErrors, (v: string) => string> = {
      nombre:   (v) => validateNombre(v),
      correo:   (v) => validateCorreo(v),
      telefono: (v) => validateTelefono(v),
      mensaje:  (v) => validateMensaje(v, false),
    };
    setErrors(prev => ({ ...prev, [field]: validators[field](value) }));
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3.5 py-2.5 rounded-xl bg-white/5 border ${
      hasError ? 'border-red-500' : 'border-white/10 focus:border-[#E31E24]'
    } text-sm text-white placeholder-gray-600 focus:outline-none transition-colors`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="recruiter"
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="fixed bottom-6 right-6 z-50 w-96 rounded-2xl overflow-hidden shadow-2xl border border-white/5"
          style={{ background: '#111111' }}
        >
          <div className="h-1 w-full bg-gradient-to-r from-[#E31E24] via-[#ff4d52] to-[#E31E24]" />

          {/* ── CARD ── */}
          {view === 'card' && (
            <div className="p-6">
              <button
                onClick={() => setVisible(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-300 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E31E24]/15 text-[#E31E24] text-[11px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  Estamos contratando
                </span>
              </div>

              <h3 className="text-xl font-bold text-white leading-snug mb-2">
                Se parte del equipo de<br />
                <span className="text-[#E31E24]">Seishin International</span>
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Buscamos personas apasionadas, creativas y comprometidas con el crecimiento real. Si quieres unirte a nuestro equipo, ¡Esta es tu oportunidad!
              </p>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: Zap,       label: 'Proyectos de impacto' },
                  { icon: Users,     label: 'Equipo de elite' },
                  { icon: Briefcase, label: 'Crecimiento real' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 text-center">
                    <Icon className="w-4 h-4 text-[#E31E24]" />
                    <span className="text-[10px] text-gray-400 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setView('form')}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E31E24] hover:bg-[#c01a20] transition-colors text-white text-sm font-bold shadow-lg shadow-[#E31E24]/20"
              >
                Quiero unirme al equipo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── FORM ── */}
          {view === 'form' && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => setView('card')} className="text-gray-400 hover:text-gray-200 transition-colors" aria-label="Volver">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p className="text-base font-bold text-white">Cuentanos de ti</p>
                <button onClick={() => setVisible(false)} className="ml-auto text-gray-600 hover:text-gray-300 transition-colors" aria-label="Cerrar">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                <div>
                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    value={form.nombre}
                    onChange={e => handleField('nombre', e.target.value)}
                    maxLength={50}
                    className={inputClass(!!errors.nombre)}
                  />
                  {errors.nombre && <p className="mt-1 text-[11px] text-red-400">{errors.nombre}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Correo electronico *"
                    value={form.correo}
                    onChange={e => handleField('correo', e.target.value)}
                    className={inputClass(!!errors.correo)}
                  />
                  {errors.correo && <p className="mt-1 text-[11px] text-red-400">{errors.correo}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Telefono (10-15 dígitos)"
                    value={form.telefono}
                    onChange={e => handleField('telefono', filterTelefono(e.target.value))}
                    maxLength={15}
                    className={inputClass(!!errors.telefono)}
                  />
                  {errors.telefono && <p className="mt-1 text-[11px] text-red-400">{errors.telefono}</p>}
                </div>

                <select
                  required
                  value={form.jobId}
                  onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#E31E24] transition-colors appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" disabled className="bg-[#1a1a1a]">Puesto de interes *</option>
                  {jobPositions.map(job => (
                    <option key={job.id} value={job.id} className="bg-[#1a1a1a]">{job.name}</option>
                  ))}
                </select>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Por que quieres unirte a Seishin International?"
                    value={form.mensaje}
                    onChange={e => handleField('mensaje', e.target.value)}
                    maxLength={500}
                    className={`${inputClass(!!errors.mensaje)} resize-none`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.mensaje
                      ? <p className="text-[11px] text-red-400">{errors.mensaje}</p>
                      : <span />
                    }
                    <span className="text-[11px] text-gray-600 ml-auto">{form.mensaje.length}/500</span>
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E31E24] hover:bg-[#c01a20] disabled:opacity-60 transition-colors text-white text-sm font-bold shadow-lg shadow-[#E31E24]/20"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    : <>Enviar postulacion <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {view === 'success' && (
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-400/10 flex items-center justify-center mt-1">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-white font-bold text-base">Postulacion recibida!</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gracias por tu interes en Seishin International. Nuestro equipo revisara tu perfil y se pondra en contacto contigo pronto.
              </p>
              <button
                onClick={() => setVisible(false)}
                className="mt-1 text-xs text-gray-600 hover:text-gray-300 transition-colors underline"
              >
                Cerrar
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
