import { useState } from 'react';
import { Send, Phone, Mail, Clock, MapPin, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createContactMessage } from '@/services/odooService';
import {
  validateNombre,
  validateCorreo,
  validateEmpresa,
  validateMensaje,
} from '@/lib/formValidation';
import { SwalSuccess, SwalError } from '@/lib/swal';

type Status = 'idle' | 'loading';

const emptyErrors = { nombre: '', correo: '', empresa: '', mensaje: '' };

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    empresa: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState(emptyErrors);
  const [status, setStatus] = useState<Status>('idle');

  const validateAll = () => {
    const newErrors = {
      nombre: validateNombre(formData.nombre),
      correo: validateCorreo(formData.correo),
      empresa: validateEmpresa(formData.empresa),
      mensaje: validateMensaje(formData.mensaje),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus('loading');
    try {
      await createContactMessage(formData);
      setFormData({ nombre: '', correo: '', empresa: '', mensaje: '' });
      setErrors(emptyErrors);
      SwalSuccess(t('contact.success_title'), t('contact.success_desc'));
    } catch (err) {
      SwalError(
        t('contact.error_title'),
        err instanceof Error ? err.message : t('contact.error_fallback'),
      );
    } finally {
      setStatus('idle');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const validators: Record<string, (v: string) => string> = {
      nombre: validateNombre,
      correo: validateCorreo,
      empresa: validateEmpresa,
      mensaje: validateMensaje,
    };
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const inputClass = (error: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      error
        ? 'border-red-500 focus:ring-red-500/20'
        : 'border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]/20'
    } bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 outline-none transition-colors duration-200`;

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--blue-corporate)] to-[var(--accent-primary)]">
              {t('contact.heading')}
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4">
            {t('contact.intro')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)]">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{t('contact.info_title')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">{t('contact.phone_label')}</p>
                    <a href="tel:4492917919" className="text-[var(--text-primary)] font-semibold hover:text-[var(--accent-primary)] transition-colors">
                      449-291-7919
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">{t('contact.email_label')}</p>
                    <a href="mailto:info@seishin.com.mx" className="text-[var(--text-primary)] font-semibold hover:text-[var(--accent-primary)] transition-colors break-all">
                      info@seishin.com.mx
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">{t('contact.hours_label')}</p>
                    <p className="text-[var(--text-primary)] font-semibold">
                      {t('contact.hours_value_line_1')}
                      <br />
                      {t('contact.hours_value_line_2')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--accent-primary)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm">{t('contact.location_label')}</p>
                    <p className="text-[var(--text-primary)] font-semibold">
                      {t('contact.location_value_line_1')}
                      <br />
                      {t('contact.location_value_line_2')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--blue-corporate)] to-[var(--accent-primary)] p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-3">{t('contact.callout_title')}</h3>
              <p className="text-white/90 text-sm">{t('contact.callout_desc')}</p>
            </div>
          </div>

          <div className="lg:col-span-3 bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[var(--border-color)]">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    {t('contact.name_label')}
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    maxLength={50}
                    className={inputClass(errors.nombre)}
                    placeholder={t('contact.name_placeholder')}
                  />
                  {errors.nombre && <p className="mt-1 text-xs text-red-400">{errors.nombre}</p>}
                </div>

                <div>
                  <label htmlFor="correo" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    {t('contact.email_field_label')}
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={inputClass(errors.correo)}
                    placeholder={t('contact.email_placeholder')}
                  />
                  {errors.correo && <p className="mt-1 text-xs text-red-400">{errors.correo}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="empresa" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  {t('contact.company_label')}
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className={inputClass(errors.empresa)}
                  placeholder={t('contact.company_placeholder')}
                />
                {errors.empresa && <p className="mt-1 text-xs text-red-400">{errors.empresa}</p>}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  {t('contact.message_label')}
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  className={`${inputClass(errors.mensaje)} resize-none`}
                  placeholder={t('contact.message_placeholder')}
                />
                <div className="flex justify-between items-start mt-1">
                  {errors.mensaje ? <p className="text-xs text-red-400">{errors.mensaje}</p> : <span />}
                  <span className="text-xs text-[var(--text-secondary)] ml-auto">{formData.mensaje.length}/500</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] hover:shadow-lg hover:shadow-[#f97316]/50 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('contact.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('contact.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
