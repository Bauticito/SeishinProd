import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import ProposalModal from './ProposalModal';

const BRANCH_MAP: Record<string, string> = {
  outsourcing_op:  'A',
  outsourcing_adm: 'A',
  inspeccion:      'B',
  traduccion:      'C',
  consultoria:     'C',
  reclutamiento:   'D',
  transporte:      'E',
};

const STEP_LABELS = ['Servicio', 'Empresa', 'Contacto', 'Detalle', 'Facturación', 'Documentos', 'Resumen'];

const initialForm = {
  // Step 0
  services:          [] as string[],
  start_date:        '',
  urgency:           'low',
  branches:          [] as string[],
  // Step 1
  company_name:      '',
  rfc:               '',
  cp:                '',
  industry:          'automotriz',
  size:              '1-50',
  address:           '',
  japanese:          'no',
  // Step 2
  contact_name:      '',
  position:          'rh',
  email:             '',
  phone:             '',
  preferred_channel: 'email',
  approver:          '',
  // Step 3
  op_type:           'produccion',
  supervision:       'client',
  activities:        '',
  prof_1:            '',
  qty_1:             '',
  shift_1:           '',
  insp_type:         'visual',
  part_name:         '',
  notes:             '',
  // Step 4
  requires_po:       'no',
  payment_terms:     '30',
  billing_freq:      'monthly',
  currency:          'mxn',
  // Step 5
  files:             [] as File[],
  // Step 6
  confirmed:         false,
};

type FormData = typeof initialForm;

export default function CotizadorWizard() {
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState<FormData>(initialForm);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, type } = e.target;

      if (type === 'checkbox') {
        const el = e.target as HTMLInputElement;
        if (name === 'services') {
          const val = el.value;
          const next = el.checked
            ? [...form.services, val]
            : form.services.filter(s => s !== val);
          const branches = [...new Set(next.map(s => BRANCH_MAP[s]).filter(Boolean))];
          setForm(f => ({ ...f, services: next, branches }));
        } else {
          setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
        }
      } else if (name === 'files') {
        const el = e.target as HTMLInputElement;
        setForm(f => ({ ...f, files: Array.from(el.files || []) }));
      } else {
        setForm(f => ({ ...f, [name]: e.target.value }));
      }
    },
    [form.services],
  );

  const STEPS = [
    <Step0 key={0} formData={form} onChange={handleChange} />,
    <Step1 key={1} formData={form} onChange={handleChange} />,
    <Step2 key={2} formData={form} onChange={handleChange} />,
    <Step3 key={3} formData={form} onChange={handleChange} />,
    <Step4 key={4} formData={form} onChange={handleChange} />,
    <Step5 key={5} formData={form} onChange={handleChange} />,
    <Step6 key={6} formData={form} onChange={handleChange} />,
  ];

  return (
    <>
      <div className="max-w-3xl mx-auto px-4">

        {/* ── Step progress ── */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-1 mb-3 relative">
            <div className="absolute top-4 left-4 right-4 h-px bg-[var(--border-color-light)]" />
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="relative flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                  i < step
                    ? 'bg-[#E31E24] text-white'
                    : i === step
                    ? 'bg-[#E31E24] text-white ring-4 ring-[#E31E24]/20'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-color-light)]'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[9px] tracking-wide font-semibold hidden sm:block text-center leading-tight ${
                  i === step ? 'text-[#E31E24]' : 'text-[var(--text-tertiary)]'
                }`}>
                  {label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-1 mt-2">
            <div
              className="bg-[#E31E24] h-1 rounded-full transition-all duration-500"
              style={{ width: `${(step / (STEP_LABELS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* ── Step content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-2xl border border-[var(--border-color-light)] p-6 md:p-8 mb-6 cotizador-step"
          >
            {STEPS[step]}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color-light)] text-[var(--text-secondary)] hover:border-[#E31E24]/40 hover:text-[var(--text-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <span className="text-xs text-[var(--text-tertiary)] font-mono">
            {step + 1} / {STEP_LABELS.length}
          </span>

          {step < STEP_LABELS.length - 1 ? (
            <button
              onClick={() => setStep(s => Math.min(STEP_LABELS.length - 1, s + 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color-light)] text-[var(--text-primary)] hover:border-[#E31E24]/40 transition-all"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              disabled={!form.confirmed}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Enviar Solicitud
            </button>
          )}
        </div>
      </div>

      {/* ── Proposal Modal ── */}
      <ProposalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // reset wizard after closing if desired
        }}
        wizardData={form}
      />
    </>
  );
}
