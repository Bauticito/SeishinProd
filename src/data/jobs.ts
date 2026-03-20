export interface JobVacancy {
  id: string;
  slug: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  category: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'YEAR' | 'MONTH' | 'HOUR';
  };
  postedDate: string;
  validThrough: string;
  hiringOrganization: {
    name: string;
    sameAs: string;
    logo: string;
  };
  experienceRequirements?: string;
  educationRequirements?: string;
  benefits?: string[];
  schedule?: string;
}

export const JOB_VACANCIES: JobVacancy[] = [
  {
    id: 'montacarguista',
    slug: 'montacarguista',
    title: 'MONTACARGUISTA',
    company: 'Seishin International',
    description: 'Operación segura de montacargas, carga y descarga de materiales, control de inventarios y apoyo en almacén industrial.',
    requirements: [
      'Licencia de montacarguista vigente (DC-3).',
      'Experiencia mínima de 2 años en almacenes industriales.',
      'Conocimiento de normas de seguridad e higiene.',
      'Disponibilidad para rolar turnos.'
    ],
    type: 'Full-time',
    category: 'Logística',
    postedDate: '2024-03-20',
    validThrough: '2024-06-20',
    hiringOrganization: {
      name: 'Seishin International',
      sameAs: 'https://seishin.com.mx',
      logo: 'https://seishin.com.mx/seishin-SinFondo.png'
    },
    benefits: ['Prestaciones de ley', 'Vales de despensa', 'Bono de puntualidad']
  },
  {
    id: 'soldador',
    slug: 'soldador',
    title: 'SOLDADOR',
    company: 'Seishin International',
    description: 'Soldadura industrial especializada, interpretación de planos técnicos y ensamble de estructuras metálicas de alta precisión.',
    requirements: [
      'Experiencia comprobable en soldadura MIG/TIG.',
      'Habilidad para lectura e interpretación de planos.',
      'Uso de herramientas de medición y corte.',
      'Certificación vigente (deseable).'
    ],
    type: 'Full-time',
    category: 'Producción',
    postedDate: '2024-03-20',
    validThrough: '2024-06-20',
    hiringOrganization: {
      name: 'Seishin International',
      sameAs: 'https://seishin.com.mx',
      logo: 'https://seishin.com.mx/seishin-SinFondo.png'
    },
    benefits: ['Prestaciones de ley', 'Seguro de vida', 'Capacitación técnica']
  },
  {
    id: 'operario',
    slug: 'operario',
    title: 'OPERARIO',
    company: 'Seishin International',
    description: 'Apoyo general en líneas de producción automatizadas, ensamble de componentes y cumplimiento de estándares de calidad.',
    requirements: [
      'Secundaria o bachillerato terminado.',
      'Ganas de aprender y proactividad.',
      'Puntualidad y compromiso.',
      'No se requiere experiencia previa (entrenamiento brindado).'
    ],
    type: 'Full-time',
    category: 'Producción',
    postedDate: '2024-03-20',
    validThrough: '2024-06-20',
    hiringOrganization: {
      name: 'Seishin International',
      sameAs: 'https://seishin.com.mx',
      logo: 'https://seishin.com.mx/seishin-SinFondo.png'
    },
    benefits: ['Prestaciones de ley', 'Transporte', 'Oportunidad de crecimiento']
  }
];
