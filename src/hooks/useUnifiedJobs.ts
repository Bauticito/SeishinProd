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

        const unified = odooJobs.map((oj) => {
          const nameFromOdoo = oj.name.toUpperCase() === 'SOLDADO' ? 'SOLDADOR' : oj.name;
          const staticJob = JOB_VACANCIES.find(
            (sj) => sj.title.toLowerCase() === oj.name.toLowerCase() || sj.id === String(oj.id),
          );

          const job: JobVacancy = {
            id: String(oj.id),
            slug: nameFromOdoo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
            title: nameFromOdoo,
            company: 'Seishin International',
            description: oj.website_description || oj.job_details || staticJob?.description || 'Contactanos para mas detalles sobre este puesto.',
            requirements: oj.requirements ? [oj.requirements] : staticJob?.requirements || ['Consultar con el reclutador'],
            type: 'Full-time',
            category: staticJob?.category || 'General',
            location: staticJob?.location || 'Aguascalientes y Guanajuato, Mexico',
            searchKeywords: staticJob?.searchKeywords || [],
            postedDate: oj.published_date || new Date().toISOString().split('T')[0],
            validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            hiringOrganization: {
              name: 'Seishin International',
              sameAs: 'https://seishin.com.mx',
              logo: 'https://seishin.com.mx/seishin-SinFondo.png',
            },
            benefits: staticJob?.benefits || ['Prestaciones de ley'],
          };

          return job;
        });

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
