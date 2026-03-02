import { jsPDF } from 'jspdf';

// ─── paleta ──────────────────────────────────────────────────────────────────
const C = {
  red:      [227, 30,  36]  as const,
  dark:     [18,  18,  18]  as const,
  dark2:    [36,  36,  36]  as const,
  dark3:    [58,  58,  58]  as const,
  mid:      [85,  85,  85]  as const,
  gray:     [130, 130, 130] as const,
  lgray:    [178, 178, 178] as const,
  border:   [218, 218, 218] as const,
  white:    [255, 255, 255] as const,
  card:     [248, 248, 248] as const,
  strip:    [240, 240, 240] as const,
  infobar:  [245, 245, 245] as const,
  green:    [45,  155, 70]  as const,
};

// ─── layout ──────────────────────────────────────────────────────────────────
const PW  = 210;
const PH  = 297;
const ML  = 13;
const LX  = ML;
const LW  = 89;
const RX  = LX + LW + 8;   // 110
const RW  = PW - RX - ML;  // 87
const FY  = PH - 12;       // 285
const ROW = 6.5;

// ─── tipos ───────────────────────────────────────────────────────────────────
export interface PDFQuoteData {
  service: string;
  subService: string;
  quantity: number | string;
  months?: number;
  estimate: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  company?: string;
  notes?: string;
  setup?: number;
  monthly?: number;
  riskScore?: number;
  coverageLabel?: string;
  breakdown?: Record<string, number>;
}

// ─── utilidades ──────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
  }).format(v);

const fmtDate = () =>
  new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

const mkFolio = () => {
  const d = new Date();
  return `COT-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900) + 100}`;
};

// Tarjeta izquierda con franja roja
function card(doc: jsPDF, x: number, y: number, w: number, h: number): void {
  doc.setFillColor(...C.red);
  doc.rect(x, y, 2.5, h, 'F');
  doc.setFillColor(...C.card);
  doc.rect(x + 2.5, y, w - 2.5, h, 'F');
}

// Título dentro de tarjeta
function cardTitle(doc: jsPDF, x: number, y: number, text: string): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.red);
  doc.text(text.toUpperCase(), x + 5, y);
  doc.setFillColor(...C.border);
  doc.rect(x + 5, y + 1.5, LW - 8, 0.25, 'F');
  return y + 6.5;
}

// Título columna derecha
function rTitle(doc: jsPDF, x: number, y: number, text: string, w: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.red);
  doc.text(text.toUpperCase(), x, y);
  doc.setFillColor(...C.red);
  doc.rect(x, y + 1.5, w, 0.3, 'F');
  return y + 6.5;
}

// Fila de datos (etiqueta + valor)
function row(
  doc: jsPDF,
  x: number, y: number,
  lbl: string, val: string,
  labelX: number, maxValW: number,
  i: number,
  cardX: number, cardW: number,
): number {
  if (i % 2 === 0) {
    doc.setFillColor(...C.strip);
    doc.rect(cardX + 2.5, y - 4.5, cardW - 2.5, ROW + 0.5, 'F');
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.gray);
  doc.text(lbl, x, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.dark);
  const lines = doc.splitTextToSize(val, maxValW);
  doc.text(lines, labelX, y);
  return lines.length > 1 ? lines.length * 4.2 + 1.5 : ROW;
}

// Footer rojo
function drawFooter(doc: jsPDF): void {
  doc.setFillColor(...C.red);
  doc.rect(0, FY, PW, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.white);
  doc.text('www.seishin.com.mx',    ML,      FY + 7.5);
  doc.text('ventas@seishin.com.mx', PW / 2,  FY + 7.5, { align: 'center' });
  doc.text('+52 449 115 5269',      PW - ML, FY + 7.5, { align: 'right' });
}

// ─── generador principal ─────────────────────────────────────────────────────
export function generateQuotePDF(data: PDFQuoteData): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const ref = mkFolio();

  // ══ HEADER ════════════════════════════════════════════════════════════════
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, PW, 37, 'F');

  // Franja roja lateral derecha
  doc.setFillColor(...C.red);
  doc.rect(PW - 6, 0, 6, 37, 'F');

  // Punto rojo decorativo
  doc.setFillColor(...C.red);
  doc.ellipse(ML + 1.4, 13.5, 1.8, 1.8, 'F');

  // Logo SEISHIN
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.text('SEISHIN', ML + 6, 16.5);

  // Taglines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lgray);
  doc.text('Soluciones Globales de Servicios', ML + 6, 22.5);
  doc.text('Maquinaria  ·  Traducciones  ·  Inteligencia Artificial', ML + 6, 28);

  // COTIZACIÓN (derecha)
  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('COTIZACIÓN', PW - 10, 15, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lgray);
  doc.text(ref,      PW - 10, 22, { align: 'right' });
  doc.text(fmtDate(), PW - 10, 28, { align: 'right' });

  // Separador rojo
  doc.setFillColor(...C.red);
  doc.rect(0, 37, PW, 2, 'F');

  // ══ INFO STRIP ════════════════════════════════════════════════════════════
  doc.setFillColor(...C.infobar);
  doc.rect(0, 39, PW, 13, 'F');

  doc.setFillColor(...C.border);
  doc.rect(0, 52, PW, 0.3, 'F');

  const colW3 = (PW - ML * 2) / 3;
  const strips: [string, string][] = [
    ['FOLIO',    ref],
    ['SERVICIO', data.subService],
    ['FECHA',    fmtDate()],
  ];

  strips.forEach(([lbl, val], i) => {
    const cx = ML + i * colW3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(...C.gray);
    doc.text(lbl, cx, 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.dark);
    // Truncar si es muy largo
    const truncated = doc.splitTextToSize(val, colW3 - 4)[0];
    doc.text(truncated, cx, 50);

    // divisor vertical (salvo el último)
    if (i < 2) {
      doc.setFillColor(...C.border);
      doc.rect(cx + colW3 - 1, 40, 0.3, 11, 'F');
    }
  });

  // ══ COLUMNAS ══════════════════════════════════════════════════════════════
  const TOP = 58;
  let lY = TOP;
  let rY = TOP;

  // ─ IZQUIERDA ─────────────────────────────────────────────────────────────
  const hasContact =
    data.customerName || data.customerEmail || data.customerPhone || data.company;

  const contactRows: [string, string][] = hasContact ? [
    ...(data.customerName  ? [['Nombre',   data.customerName]  as [string, string]] : []),
    ...(data.company       ? [['Empresa',  data.company]       as [string, string]] : []),
    ...(data.customerEmail ? [['Correo',   data.customerEmail] as [string, string]] : []),
    ...(data.customerPhone ? [['Teléfono', data.customerPhone] as [string, string]] : []),
  ] : [];

  const qtyStr = typeof data.quantity === 'string'
    ? `${data.quantity} cámaras`
    : data.service.toLowerCase().includes('traductor') || data.service.toLowerCase().includes('traducción')
      ? `${data.quantity} hora${data.quantity !== 1 ? 's' : ''}`
      : `${data.quantity} persona${data.quantity !== 1 ? 's' : ''}`;

  const serviceRows: [string, string][] = [
    ['Servicio',     data.service],
    ['Sub-servicio', data.subService],
    ['Cantidad',     qtyStr],
    ...(data.months ? [['Duración', `${data.months} mes${data.months !== 1 ? 'es' : ''}`] as [string, string]] : []),
  ];

  // Tarjeta cliente
  if (contactRows.length > 0) {
    const h = 11 + contactRows.length * ROW + 2;
    card(doc, LX, lY, LW, h);
    lY = cardTitle(doc, LX, lY + 5, '● Datos del cliente');
    contactRows.forEach(([lbl, val], i) => {
      lY += row(doc, LX + 5, lY, lbl, val, LX + 27, LW - 32, i, LX, LW);
    });
    lY += 7;
  }

  // Tarjeta servicio
  const sh = 11 + serviceRows.length * ROW + 2;
  card(doc, LX, lY, LW, sh);
  lY = cardTitle(doc, LX, lY + 5, '● Detalle del servicio');
  serviceRows.forEach(([lbl, val], i) => {
    lY += row(doc, LX + 5, lY, lbl, val, LX + 28, LW - 33, i, LX, LW);
  });
  lY += 7;

  // Tarjeta notas
  if (data.notes) {
    const noteLines = doc.splitTextToSize(data.notes, LW - 14);
    const nh = 11 + noteLines.length * 4 + 2;
    card(doc, LX, lY, LW, nh);
    lY = cardTitle(doc, LX, lY + 5, '● Notas adicionales');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.dark);
    doc.text(noteLines, LX + 5, lY);
    lY += noteLines.length * 4 + 6;
  }

  // ─ DERECHA ───────────────────────────────────────────────────────────────
  const isVision = data.monthly !== undefined && data.setup !== undefined;
  const cardH = isVision ? 46 : 36;

  // Tarjeta precio (oscura)
  doc.setFillColor(...C.dark2);
  doc.roundedRect(RX, rY, RW, cardH, 2, 2, 'F');

  // Label + línea roja interna
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...C.lgray);
  doc.text('ESTIMACIÓN APROXIMADA', RX + 4, rY + 5.5);
  doc.setFillColor(...C.red);
  doc.rect(RX + 4, rY + 7, RW - 8, 0.4, 'F');

  if (isVision) {
    const mid = RX + RW / 2;

    // Setup
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.lgray);
    doc.text('Inversión inicial', RX + 4, rY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...C.white);
    doc.text(fmt(data.setup!), RX + 4, rY + 23);

    // Divisor
    doc.setFillColor(...C.dark3);
    doc.rect(mid - 0.3, rY + 10, 0.5, 30, 'F');

    // Monthly
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.red);
    doc.text('Costo mensual', mid + 4, rY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...C.white);
    doc.text(fmt(data.monthly!), mid + 4, rY + 25);

    // Badge cobertura
    if (data.coverageLabel && data.riskScore !== undefined) {
      doc.setFillColor(...C.dark3);
      doc.roundedRect(RX + 4, rY + cardH - 10, RW - 8, 8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.lgray);
      doc.text(
        `COBERTURA: ${data.coverageLabel?.toUpperCase()}  (${data.riskScore}/100)`,
        RX + RW / 2, rY + cardH - 5, { align: 'center' },
      );
    }
  } else {
    // Estimación simple
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(...C.white);
    const estLines = doc.splitTextToSize(data.estimate, RW - 8);
    doc.text(estLines, RX + 4, rY + 20);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6);
    doc.setTextColor(...C.lgray);
    doc.text('Sujeto a ajuste tras diagnóstico.', RX + 4, rY + cardH - 4);
  }

  rY += cardH + 7;

  // ··· Desglose mensual
  if (data.breakdown) {
    rY = rTitle(doc, RX, rY, '● Desglose mensual', RW);

    const bMap: [string, string][] = [
      ['baseMonthly',           'Base'],
      ['camerasMonthly',        'Cámaras'],
      ['riskMonthly',           'Riesgo'],
      ['coverageMonthly',       'Cobertura'],
      ['intelligenceMonthly',   'Nivel inteligencia'],
      ['privacyMonthly',        'Privacidad / Dispositivo'],
      ['installMonthly',        'Implementación'],
      ['volumeDiscountMonthly', 'Desc. volumen'],
    ];

    let bi = 0;
    for (const [key, lbl] of bMap) {
      const v = data.breakdown[key];
      if (v === undefined) continue;

      if (bi % 2 === 0) {
        doc.setFillColor(...C.strip);
        doc.rect(RX, rY - 4.5, RW, ROW + 0.5, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...C.mid);
      doc.text(lbl, RX + 2, rY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      if (v < 0) {
        doc.setTextColor(...C.green);
      } else {
        doc.setTextColor(...C.dark);
      }
      doc.text(fmt(v), RX + RW - 2, rY, { align: 'right' });

      rY += ROW;
      bi++;
    }

    // Línea total
    rY += 2;
    doc.setFillColor(...C.dark);
    doc.rect(RX, rY, RW, 0.4, 'F');
    rY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.red);
    doc.text('TOTAL MENSUAL', RX + 2, rY);
    doc.setTextColor(...C.dark);
    doc.text(fmt(data.monthly ?? 0), RX + RW - 2, rY, { align: 'right' });
    rY += 7;
  }

  // ══ CIERRE ════════════════════════════════════════════════════════════════
  const endY = Math.max(lY, rY) + 5;

  doc.setFillColor(...C.border);
  doc.rect(ML, endY, PW - ML * 2, 0.4, 'F');

  const disc =
    'Esta cotización es una estimación referencial y no constituye un contrato. ' +
    'Los precios definitivos se confirman tras el diagnóstico personalizado.';
  const dLines = doc.splitTextToSize(disc, PW - ML * 2);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.gray);
  doc.text(dLines, ML, endY + 5.5);

  drawFooter(doc);

  const slug = data.subService.replace(/[\s/–—]+/g, '-').toLowerCase();
  doc.save(`cotizacion-seishin-${slug}.pdf`);
}
