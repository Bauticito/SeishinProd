import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, FileDown, AlertCircle } from 'lucide-react';
import { createOdooQuotation } from '../../services/odooService';
import { generateQuotePDF } from '../../lib/generateQuotePDF';

const SERVICES_MAP: Record<string, string> = {
  outsourcing_op:  'Outsourcing Operativo',
  outsourcing_adm: 'Outsourcing Administrativo',
  inspeccion:      'Inspección de Calidad',
  traduccion:      'Traducción (Evento/Planta)',
  consultoria:     'Consultoría LFT/SAT/REPSE',
  reclutamiento:   'Reclutamiento y Selección',
  transporte:      'Transporte de Personal',
  otros:           'Otros',
};

export interface WizardSnapshot {
  services:      string[];
  start_date:    string;
  urgency:       string;
  company_name:  string;
  rfc:           string;
  cp:            string;
  industry:      string;
  size:          string;
  address:       string;
  japanese:      string;
  contact_name:  string;
  position:      string;
  email:         string;
  phone:         string;
  preferred_channel: string;
  approver:      string;
  op_type:       string;
  supervision:   string;
  activities:    string;
  insp_type:     string;
  part_name:     string;
  notes:         string;
  requires_po:   string;
  payment_terms: string;
  billing_freq:  string;
  currency:      string;
  branches:      string[];
}

interface Props {
  open:         boolean;
  onClose:      () => void;
  wizardData:   WizardSnapshot;
}

const URGENCY: Record<string, string> = {
  low:    'Solo cotización (Planeación)',
  medium: 'Media (15-30 días)',
  high:   'Alta (Inmediato)',
};

export default function ProposalModal({ open, onClose, wizardData }: Props) {
  // pre-fill from wizard
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [company, setCompany] = useState('');
  const [notes,   setNotes]   = useState('');
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setName(wizardData.contact_name || '');
      setEmail(wizardData.email || '');
      setPhone(wizardData.phone || '');
      setCompany(wizardData.company_name || '');
      setNotes('');
      setStatus('idle');
      setErrorMsg('');
    }
  }, [open, wizardData]);

  const servicesLabel = wizardData.services.length > 0
    ? wizardData.services.map(s => SERVICES_MAP[s] || s).join(' · ')
    : 'Solicitud de cotización';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const lines = [
        '── Solicitud de Cotización ──',
        `Servicios: ${servicesLabel}`,
        `Fecha de inicio: ${wizardData.start_date || 'N/A'}`,
        `Urgencia: ${URGENCY[wizardData.urgency] ?? wizardData.urgency}`,
        '',
        '── Empresa ──',
        `Razón Social: ${wizardData.company_name}`,
        `RFC: ${wizardData.rfc}`,
        `C.P.: ${wizardData.cp}`,
        `Industria: ${wizardData.industry}`,
        `Tamaño: ${wizardData.size}`,
        `Dirección: ${wizardData.address}`,
        `Empresa Japonesa: ${wizardData.japanese === 'yes' ? 'Sí' : 'No'}`,
        '',
        '── Contacto ──',
        `Cargo: ${wizardData.position}`,
        `Canal preferido: ${wizardData.preferred_channel}`,
        wizardData.approver ? `Autorizador: ${wizardData.approver}` : null,
        '',
        '── Detalle del Servicio ──',
        wizardData.branches.includes('A') ? `Tipo de operación: ${wizardData.op_type}` : null,
        wizardData.branches.includes('A') ? `Supervisión: ${wizardData.supervision}` : null,
        wizardData.branches.includes('A') && wizardData.activities ? `Actividades: ${wizardData.activities}` : null,
        wizardData.branches.includes('B') ? `Tipo de inspección: ${wizardData.insp_type}` : null,
        wizardData.branches.includes('B') && wizardData.part_name ? `Parte/Producto: ${wizardData.part_name}` : null,
        wizardData.notes ? `Notas del servicio: ${wizardData.notes}` : null,
        '',
        '── Facturación ──',
        `Requiere OC: ${wizardData.requires_po}`,
        `Plazo de pago: ${wizardData.payment_terms} días`,
        `Frecuencia: ${wizardData.billing_freq}`,
        `Moneda: ${wizardData.currency.toUpperCase()}`,
        notes ? `\n── Notas adicionales ──\n${notes}` : null,
      ];

      await createOdooQuotation({
        customerName:  name,
        customerEmail: email,
        customerPhone: phone,
        company,
        service:    servicesLabel,
        subService: servicesLabel,
        quantity:   wizardData.size || 'N/A',
        estimate:   'Cotización en proceso — nuestro equipo te contactará pronto',
        notes:      lines.filter(Boolean).join('\n'),
      });

      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar la solicitud');
      setStatus('error');
    }
  };

  const handleDownloadPDF = () => {
    generateQuotePDF({
      service:       servicesLabel,
      subService:    servicesLabel,
      quantity:      wizardData.size || 'N/A',
      estimate:      'Cotización en proceso — nuestro equipo te contactará pronto',
      customerName:  name,
      customerEmail: email,
      customerPhone: phone,
      company,
      notes:         notes || wizardData.notes || undefined,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.95,    y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md bg-[#1e1e1e] rounded-2xl border border-[var(--border-color-light)] shadow-2xl overflow-hidden">

              {/* ── Header ── */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Solicitar Propuesta</h2>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5 leading-snug max-w-xs line-clamp-2">
                    {servicesLabel}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#E31E24]/20 transition-all ml-4 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 pb-6">
                {status === 'success' ? (
                  /* ── Success state ── */
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="flex flex-col items-center text-center py-4 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">¡Cotización enviada!</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                        Tu solicitud fue registrada en nuestro sistema de ventas. Un asesor te contactará pronto.
                      </p>
                    </div>

                    {/* PDF download */}
                    <div className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-tertiary)] p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#E31E24]/10 flex items-center justify-center shrink-0">
                          <FileDown className="w-4 h-4 text-[#E31E24]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">Descarga tu cotización</p>
                          <p className="text-xs text-[var(--text-tertiary)]">PDF con los datos de tu solicitud</p>
                        </div>
                      </div>
                      <button
                        onClick={handleDownloadPDF}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm"
                      >
                        <FileDown className="w-4 h-4" />
                        Descargar PDF
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors py-1"
                    >
                      Cerrar
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-1.5">
                          Correo *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                          placeholder="correo@empresa.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-1.5">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                          placeholder="10 dígitos"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-1.5">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-1.5">
                        Notas Adicionales
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition resize-none"
                        placeholder="¿Algo más que debamos saber?"
                      />
                    </div>

                    {/* Error */}
                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {status === 'loading' ? 'Enviando…' : 'Enviar a Ventas'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
