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
export interface WizardSnapshot {
  services:          string[];
  start_date:        string;
  urgency:           string;
  otros_descripcion?: string;
  company_name:      string;
  rfc:               string;
  cp:                string;
  industry:          string;
  size:              string;
  address:           string;
  japanese:          string;
  contact_name:      string;
  position:          string;
  email:             string;
  phone:             string;
  preferred_channel: string;
  approver:          string;
  branches:          string[];
  op_type:           string;
  supervision:       string;
  activities:        string;
  insp_type:         string;
  part_name:         string;
  notes:             string;
  requires_po:       string;
  payment_terms:     string;
  billing_freq:      string;
  currency:          string;
}

export interface PDFQuoteData {
  service:        string;
  subService:     string;
  quantity:       number | string;
  months?:        number;
  estimate:       string;
  customerName?:  string;
  customerEmail?: string;
  customerPhone?: string;
  company?:       string;
  notes?:         string;
  setup?:         number;
  monthly?:       number;
  riskScore?:     number;
  coverageLabel?: string;
  breakdown?:     Record<string, number>;
  wizardSnapshot?: WizardSnapshot;
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

const URGENCY_MAP: Record<string, string> = {
  low:    'Solo cotización (Planeación)',
  medium: 'Media (15–30 días)',
  high:   'Alta (Inmediato)',
};

const INDUSTRY_MAP: Record<string, string> = {
  automotriz:    'Automotriz',
  logistica:     'Logística',
  metalmecanica: 'Metalmecánica',
  servicios:     'Servicios',
  otro:          'Otro',
};

const POSITION_MAP: Record<string, string> = {
  rh:        'Recursos Humanos',
  compras:   'Compras',
  operacion: 'Operaciones',
  direccion: 'Dirección',
  otro:      'Otro',
};

const CHANNEL_MAP: Record<string, string> = {
  email:     'Correo',
  whatsapp:  'WhatsApp',
  llamada:   'Llamada',
};

const OPTYPE_MAP: Record<string, string> = {
  produccion:            'Producción',
  retrabajo:             'Retrabajo',
  almacenista:           'Almacenista',
  patinero:              'Patinero',
  recepcionista:         'Recepcionista',
  facturista:            'Facturista',
  soldador:              'Soldador',
  sorteo:                'Sorteo',
  inspector_visual:      'Inspector visual',
  servicios_generales:   'Servicios generales',
  mantenimiento_edificio:'Mantenimiento de edificio',
  vigilante:             'Vigilante',
  ayudante_produccion:   'Ayudante de producción',
  empacador:             'Empacador',
  limpieza:              'Limpieza',
  picking:               'Picking',
  montacarguista:        'Montacarguista',
  gruista:               'Gruista',
  operador_torno:        'Operadores de torno',
  supervisor:            'Supervisor',
  chofer:                'Chofer',
  jardinero:             'Jardinero',
};

const SUPERVISION_MAP: Record<string, string> = {
  client:          'Cliente supervisa',
  seishin_partial: 'SEISHIN parcial',
  seishin_total:   'SEISHIN total',
};

const INSP_MAP: Record<string, string> = {
  visual:      'Visual',
  dimensional: 'Dimensional',
  sorting:     'Sorting / Contención',
};

const FREQ_MAP: Record<string, string> = {
  monthly:    'Mensual',
  biweekly:   'Quincenal',
  weekly:     'Semanal',
};

const SERVICES_LABELS: Record<string, string> = {
  outsourcing_op:  'Servicio especializado Operativo',
  outsourcing_adm: 'Servicio especializado Administrativo',
  inspeccion:      'Inspección de Calidad',
  traduccion:      'Traducción (Evento/Planta)',
  consultoria:     'Consultoría LFT/SAT/REPSE',
  reclutamiento:   'Reclutamiento y Selección',
  transporte:      'Transporte de Personal',
  servicios_de_IA: 'Servicios de IA',
  otros:           'Otros',
};

// ─── helpers de dibujo ───────────────────────────────────────────────────────
function card(doc: jsPDF, x: number, y: number, w: number, h: number): void {
  doc.setFillColor(...C.red);
  doc.rect(x, y, 2.5, h, 'F');
  doc.setFillColor(...C.card);
  doc.rect(x + 2.5, y, w - 2.5, h, 'F');
}

function cardTitle(doc: jsPDF, x: number, y: number, text: string, w: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.red);
  doc.text(text.toUpperCase(), x + 5, y);
  doc.setFillColor(...C.border);
  doc.rect(x + 5, y + 1.5, w - 8, 0.25, 'F');
  return y + 6.5;
}

function rTitle(doc: jsPDF, x: number, y: number, text: string, w: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...C.red);
  doc.text(text.toUpperCase(), x, y);
  doc.setFillColor(...C.red);
  doc.rect(x, y + 1.5, w, 0.3, 'F');
  return y + 6.5;
}

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

// Dibuja una tarjeta completa con filas y devuelve la Y final
function drawCard(
  doc: jsPDF,
  x: number, startY: number, w: number,
  title: string,
  rows: [string, string][],
): number {
  const h = 11 + rows.length * ROW + 2;
  card(doc, x, startY, w, h);
  let y = cardTitle(doc, x, startY + 5, title, w);
  rows.forEach(([lbl, val], i) => {
    y += row(doc, x + 5, y, lbl, val, x + 28, w - 33, i, x, w);
  });
  return startY + h + 6;
}

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
  const wiz = data.wizardSnapshot;

  const servicesLabel = wiz
    ? wiz.services.map(s => SERVICES_LABELS[s] || s).join(' · ') || 'Solicitud de cotización'
    : data.subService;

  // ══ HEADER ════════════════════════════════════════════════════════════════
  doc.setFillColor(...C.dark);
  doc.rect(0, 0, PW, 37, 'F');
  doc.setFillColor(...C.red);
  doc.rect(PW - 6, 0, 6, 37, 'F');
  doc.setFillColor(...C.red);
  doc.ellipse(ML + 1.4, 13.5, 1.8, 1.8, 'F');

  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.text('SEISHIN', ML + 6, 16.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lgray);
  doc.text('Soluciones Globales de Servicios', ML + 6, 22.5);
  doc.text('Servicio Especializado  ·  Inspección  ·  Reclutamiento  ·  IA', ML + 6, 28);

  doc.setTextColor(...C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('COTIZACIÓN', PW - 10, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lgray);
  doc.text(ref,       PW - 10, 22, { align: 'right' });
  doc.text(fmtDate(), PW - 10, 28, { align: 'right' });

  doc.setFillColor(...C.red);
  doc.rect(0, 37, PW, 2, 'F');

  // ══ INFO STRIP ════════════════════════════════════════════════════════════
  doc.setFillColor(...C.infobar);
  doc.rect(0, 39, PW, 13, 'F');
  doc.setFillColor(...C.border);
  doc.rect(0, 52, PW, 0.3, 'F');

  const colW3 = (PW - ML * 2) / 3;
  const strips: [string, string][] = [
    ['FOLIO',   ref],
    ['SERVICIO', doc.splitTextToSize(servicesLabel, colW3 - 4)[0]],
    ['FECHA',   fmtDate()],
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
    doc.text(val, cx, 50);
    if (i < 2) {
      doc.setFillColor(...C.border);
      doc.rect(cx + colW3 - 1, 40, 0.3, 11, 'F');
    }
  });

  // ══ COLUMNAS ══════════════════════════════════════════════════════════════
  const TOP = 58;
  let lY = TOP;
  let rY = TOP;

  // ── IZQUIERDA ─────────────────────────────────────────────────────────────
  if (wiz) {
    // 1. Datos del contacto
    const contactRows: [string, string][] = [
      ['Nombre',   wiz.contact_name || data.customerName || ''],
      ['Cargo',    POSITION_MAP[wiz.position] || wiz.position],
      ['Correo',   wiz.email || data.customerEmail || ''],
      ['Teléfono', wiz.phone || data.customerPhone || ''],
      ['Canal',    CHANNEL_MAP[wiz.preferred_channel] || wiz.preferred_channel],
      ...(wiz.approver ? [['Autorizador', wiz.approver] as [string, string]] : []),
    ].filter(([, v]) => v) as [string, string][];

    if (contactRows.length > 0) {
      lY = drawCard(doc, LX, lY, LW, '● Datos del contacto', contactRows);
    }

    // 2. Datos de la empresa
    const empresaRows: [string, string][] = [
      ['Razón Social', wiz.company_name],
      ['RFC',          wiz.rfc],
      ['C.P.',         wiz.cp],
      ['Industria',    INDUSTRY_MAP[wiz.industry] || wiz.industry],
      ['Tamaño',       wiz.size + ' empleados'],
      ['Dirección',    wiz.address],
      ['HQ',           wiz.japanese === 'yes' ? 'Sí' : 'No'],
    ].filter(([, v]) => v) as [string, string][];

    lY = drawCard(doc, LX, lY, LW, '● Datos de la empresa', empresaRows);

    // 3. Detalle del servicio (condicional por branch)
    const detailRows: [string, string][] = [];
    if (wiz.branches.includes('A')) {
      detailRows.push(['Operación', OPTYPE_MAP[wiz.op_type] || wiz.op_type]);
      detailRows.push(['Supervisión', SUPERVISION_MAP[wiz.supervision] || wiz.supervision]);
      if (wiz.activities) detailRows.push(['Actividades', wiz.activities]);
    }
    if (wiz.branches.includes('B')) {
      detailRows.push(['Inspección', INSP_MAP[wiz.insp_type] || wiz.insp_type]);
      if (wiz.part_name) detailRows.push(['Parte/Producto', wiz.part_name]);
    }
    if (wiz.notes) detailRows.push(['Notas', wiz.notes]);
    if (wiz.otros_descripcion) detailRows.push(['Otros', wiz.otros_descripcion]);

    if (detailRows.length > 0) {
      lY = drawCard(doc, LX, lY, LW, '● Detalle del servicio', detailRows);
    }

    // 4. Notas adicionales del modal
    if (data.notes) {
      const noteLines = doc.splitTextToSize(data.notes, LW - 14);
      const nh = 11 + noteLines.length * 4 + 4;
      card(doc, LX, lY, LW, nh);
      let ny = cardTitle(doc, LX, lY + 5, '● Notas adicionales', LW);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...C.dark);
      doc.text(noteLines, LX + 5, ny);
      lY += nh + 6;
    }

  } else {
    // Modo legacy (sin wizard snapshot)
    const hasContact = data.customerName || data.customerEmail || data.customerPhone || data.company;
    const contactRows: [string, string][] = hasContact ? [
      ...(data.customerName  ? [['Nombre',   data.customerName]  as [string, string]] : []),
      ...(data.company       ? [['Empresa',  data.company]       as [string, string]] : []),
      ...(data.customerEmail ? [['Correo',   data.customerEmail] as [string, string]] : []),
      ...(data.customerPhone ? [['Teléfono', data.customerPhone] as [string, string]] : []),
    ] : [];

    const qtyStr = typeof data.quantity === 'string'
      ? data.quantity
      : `${data.quantity} persona${data.quantity !== 1 ? 's' : ''}`;

    const serviceRows: [string, string][] = [
      ['Servicio',     data.service],
      ['Sub-servicio', data.subService],
      ['Cantidad',     qtyStr],
      ...(data.months ? [['Duración', `${data.months} mes${data.months !== 1 ? 'es' : ''}`] as [string, string]] : []),
    ];

    if (contactRows.length > 0) {
      lY = drawCard(doc, LX, lY, LW, '● Datos del cliente', contactRows);
    }
    lY = drawCard(doc, LX, lY, LW, '● Detalle del servicio', serviceRows);

    if (data.notes) {
      const noteLines = doc.splitTextToSize(data.notes, LW - 14);
      const nh = 11 + noteLines.length * 4 + 4;
      card(doc, LX, lY, LW, nh);
      let ny = cardTitle(doc, LX, lY + 5, '● Notas adicionales', LW);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...C.dark);
      doc.text(noteLines, LX + 5, ny);
      lY += nh + 6;
    }
  }

  // ── DERECHA ───────────────────────────────────────────────────────────────
  // 1. Estimación
  const isVision = data.monthly !== undefined && data.setup !== undefined;
  const cardH = isVision ? 46 : 36;

  doc.setFillColor(...C.dark2);
  doc.roundedRect(RX, rY, RW, cardH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...C.lgray);
  doc.text('ESTIMACIÓN APROXIMADA', RX + 4, rY + 5.5);
  doc.setFillColor(...C.red);
  doc.rect(RX + 4, rY + 7, RW - 8, 0.4, 'F');

  if (isVision) {
    const mid = RX + RW / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.lgray);
    doc.text('Inversión inicial', RX + 4, rY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...C.white);
    doc.text(fmt(data.setup!), RX + 4, rY + 23);
    doc.setFillColor(...C.dark3);
    doc.rect(mid - 0.3, rY + 10, 0.5, 30, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.red);
    doc.text('Costo mensual', mid + 4, rY + 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...C.white);
    doc.text(fmt(data.monthly!), mid + 4, rY + 25);
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

  // 2. Info de solicitud (wizard)
  if (wiz) {
    rY = rTitle(doc, RX, rY, '● Solicitud', RW);

    const infoRows: [string, string][] = [
      ['Servicios', servicesLabel],
      ['Inicio estimado', wiz.start_date || 'Por definir'],
      ['Urgencia', URGENCY_MAP[wiz.urgency] || wiz.urgency],
    ];

    infoRows.forEach(([lbl, val], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...C.strip);
        doc.rect(RX, rY - 4.5, RW, ROW + 0.5, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.gray);
      doc.text(lbl, RX + 2, rY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...C.dark);
      const lines = doc.splitTextToSize(val, RW - 28);
      doc.text(lines, RX + 26, rY);
      rY += lines.length > 1 ? lines.length * 4.2 + 1.5 : ROW;
    });

    rY += 7;

    // 3. Facturación
    rY = rTitle(doc, RX, rY, '● Facturación', RW);

    const billingRows: [string, string][] = [
      ['Requiere OC',  wiz.requires_po === 'si' ? 'Sí' : 'No'],
      ['Plazo',        wiz.payment_terms + ' días'],
      ['Frecuencia',   FREQ_MAP[wiz.billing_freq] || wiz.billing_freq],
      ['Moneda',       wiz.currency.toUpperCase()],
    ];

    billingRows.forEach(([lbl, val], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...C.strip);
        doc.rect(RX, rY - 4.5, RW, ROW + 0.5, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...C.gray);
      doc.text(lbl, RX + 2, rY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.dark);
      doc.text(val, RX + 26, rY);
      rY += ROW;
    });

    rY += 7;
  }

  // 4. Desglose mensual (modo vision)
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
      doc.setTextColor(v < 0 ? C.green[0] : C.dark[0], v < 0 ? C.green[1] : C.dark[1], v < 0 ? C.green[2] : C.dark[2]);
      doc.text(fmt(v), RX + RW - 2, rY, { align: 'right' });
      rY += ROW;
      bi++;
    }

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

  const slug = servicesLabel.replace(/[\s/–—·]+/g, '-').toLowerCase().slice(0, 40);
  doc.save(`cotizacion-seishin-${slug}.pdf`);
}
