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
<<<<<<< HEAD
=======
  searchKeywords?: string[];
>>>>>>> 49dde14e91c2d2e058c81189e3bfd6c0e55507a5
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
    description: 'Operacion segura de montacargas, carga y descarga de materiales, control de inventarios y apoyo en almacen industrial.',
    requirements: [
      'Licencia de montacarguista vigente (DC-3).',
      'Experiencia minima de 2 anos en almacenes industriales.',
      'Conocimiento de normas de seguridad e higiene.',
      'Disponibilidad para rolar turnos.',
    ],
    type: 'Full-time',
<<<<<<< HEAD
    category: 'Logística',
    location: 'México',
=======
    category: 'Logistica',
    location: 'Guanajuato, Mexico',
    searchKeywords: ['vacante montacarguista guanajuato', 'empleo montacarguista guanajuato', 'trabajo montacarguista'],
>>>>>>> 49dde14e91c2d2e058c81189e3bfd6c0e55507a5
    postedDate: '2024-03-20',
    validThrough: '2024-06-20',
    hiringOrganization: {
      name: 'Seishin International',
      sameAs: 'https://seishin.com.mx',
      logo: 'https://seishin.com.mx/seishin-SinFondo.png',
    },
    benefits: ['Prestaciones de ley', 'Vales de despensa', 'Bono de puntualidad'],
  },
  {
    id: 'soldador',
    slug: 'soldador',
    title: 'SOLDADOR',
    company: 'Seishin International',
    description: 'Soldadura industrial especializada, interpretacion de planos tecnicos y ensamble de estructuras metalicas de alta precision.',
    requirements: [
      'Experiencia comprobable en soldadura MIG/TIG.',
      'Habilidad para lectura e interpretacion de planos.',
      'Uso de herramientas de medicion y corte.',
      'Certificacion vigente (deseable).',
    ],
    type: 'Full-time',
<<<<<<< HEAD
    category: 'Producción',
    location: 'México',
=======
    category: 'Produccion',
    location: 'Aguascalientes, Mexico',
    searchKeywords: ['vacante soldador aguascalientes', 'empleo soldador aguascalientes', 'trabajo de soldador'],
>>>>>>> 49dde14e91c2d2e058c81189e3bfd6c0e55507a5
    postedDate: '2024-03-20',
    validThrough: '2024-06-20',
    hiringOrganization: {
      name: 'Seishin International',
      sameAs: 'https://seishin.com.mx',
      logo: 'https://seishin.com.mx/seishin-SinFondo.png',
    },
    benefits: ['Prestaciones de ley', 'Seguro de vida', 'Capacitacion tecnica'],
  },
  {
    id: 'operario',
    slug: 'operario',
    title: 'OPERARIO',
    company: 'Seishin International',
    description: 'Apoyo general en lineas de produccion automatizadas, ensamble de componentes y cumplimiento de estandares de calidad.',
    requirements: [
      'Secundaria o bachillerato terminado.',
      'Ganas de aprender y proactividad.',
      'Puntualidad y compromiso.',
      'No se requiere experiencia previa (entrenamiento brindado).',
    ],
    type: 'Full-time',
<<<<<<< HEAD
    category: 'Producción',
    location: 'México',
=======
    category: 'Produccion',
    location: 'Aguascalientes, Mexico',
    searchKeywords: ['vacante operario aguascalientes', 'empleo operario aguascalientes', 'trabajo operario produccion'],
>>>>>>> 49dde14e91c2d2e058c81189e3bfd6c0e55507a5
    postedDate: '2024-03-20',
    validThrough: '2024-06-20',
    hiringOrganization: {
      name: 'Seishin International',
      sameAs: 'https://seishin.com.mx',
      logo: 'https://seishin.com.mx/seishin-SinFondo.png',
    },
    benefits: ['Prestaciones de ley', 'Transporte', 'Oportunidad de crecimiento'],
  },
];
