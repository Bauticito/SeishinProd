import { useState, useEffect } from 'react';
import { JOB_VACANCIES, JobVacancy } from '../data/jobs';
import { getJobPositions } from '../services/odooService';

export function useUnifiedJobs() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const odooJobs = await getJobPositions();
        
        const unified = odooJobs.map(oj => {
          const staticJob = JOB_VACANCIES.find(sj => 
            sj.title.toLowerCase() === oj.name.toLowerCase() || 
            sj.id === String(oj.id)
          );

          if (staticJob) {
            return {
              ...staticJob,
              id: String(oj.id)
            };
          }

          // Fallback if not in static data, using Odoo fields
          return {
            id: String(oj.id),
            slug: oj.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
            title: oj.name,
            company: 'Seishin International',
            description: oj.website_description || oj.job_details || 'Estamos buscando talento para unirse a nuestro equipo. Contáctanos para más detalles sobre los requisitos y responsabilidades de este puesto.',
            requirements: oj.requirements ? [oj.requirements] : ['Consultar con el reclutador'],
            type: 'Full-time' as const,
            category: 'General',
            postedDate: oj.published_date || new Date().toISOString().split('T')[0],
            validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            hiringOrganization: {
              name: 'Seishin International',
              sameAs: 'https://seishin.com.mx',
              logo: 'https://seishin.com.mx/seishin-SinFondo.png'
            }
          };
        });

        // Use unified if present, otherwise fallback to static for safety
        setJobs(unified.length > 0 ? unified : JOB_VACANCIES);
      } catch (err) {
        console.error('Error fetching Odoo jobs:', err);
        setJobs(JOB_VACANCIES);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return { jobs, loading };
}
