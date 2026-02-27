import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2, AlertCircle, FileDown } from 'lucide-react';
import { createOdooQuotation, type OdooQuoteData, type OdooOrderLine } from '@/services/odooService';
import { generateQuotePDF, type PDFQuoteData } from '@/lib/generateQuotePDF';

interface ProposalModalProps {
  open: boolean;
  onClose: () => void;
  quoteContext: {
    service: string;
    subService: string;
    quantity: number | string;
    months?: number;
    estimate: string;
    // Vision extras (optional)
    setup?: number;
    monthly?: number;
    riskScore?: number;
    coverageLabel?: string;
    breakdown?: Record<string, number>;
    // Líneas de precio para Odoo
    orderLines?: OdooOrderLine[];
  };
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ProposalModal({ open, onClose, quoteContext }: ProposalModalProps) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    company: '',
    notes: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const payload: OdooQuoteData = {
      ...form,
      ...quoteContext,
    };

    try {
      await createOdooQuotation(payload);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleDownloadPDF = () => {
    const pdfData: PDFQuoteData = {
      ...quoteContext,
      ...(status === 'success' ? form : {}),
    };
    generateQuotePDF(pdfData);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStatus('idle');
      setErrorMsg('');
      setForm({ customerName: '', customerEmail: '', customerPhone: '', company: '', notes: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white">Solicitar Propuesta</h2>
                <p className="text-sm text-white/50 mt-1">
                  {quoteContext.service} — {quoteContext.subService}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Resumen de cotización */}
            <div className="mx-8 mb-6 rounded-xl bg-[#E31E24]/10 border border-[#E31E24]/20 px-5 py-3 flex items-center justify-between">
              <span className="text-sm text-white/60">Estimación aproximada</span>
              <span className="text-lg font-black text-[#E31E24]">{quoteContext.estimate}</span>
            </div>

            {/* Success state */}
            {status === 'success' ? (
              <div className="px-8 pb-10 flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Cotización enviada!</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Tu solicitud fue registrada en nuestro sistema de ventas.<br />
                    Un asesor te contactará pronto.
                  </p>
                </div>

                {/* PDF download card */}
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E31E24]/20 flex items-center justify-center text-[#E31E24]">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Descarga tu cotización</p>
                      <p className="text-xs text-white/40">PDF con tu estimación y datos del servicio</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E31E24] hover:bg-[#c41920] text-white text-sm font-bold transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    Descargar PDF
                  </button>
                </div>

                <button
                  onClick={handleClose}
                  className="text-white/40 text-sm font-medium hover:text-white transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="Juan García"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E31E24]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                      Correo *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={form.customerEmail}
                      onChange={handleChange}
                      placeholder="juan@empresa.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E31E24]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      placeholder="+52 449 000 0000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E31E24]/60 transition-colors"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Mi Empresa S.A. de C.V."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E31E24]/60 transition-colors"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                      Notas adicionales
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Cuéntanos más sobre tus necesidades..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E31E24]/60 transition-colors resize-none"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-300">
                      {errorMsg || 'No se pudo enviar la cotización. Intenta de nuevo.'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar a Ventas
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
