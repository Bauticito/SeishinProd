import { useEffect } from 'react';
import { JobVacancy } from '../../data/jobs';

interface JobPostingSchemaProps {
  job: JobVacancy;
}

export default function JobPostingSchema({ job }: JobPostingSchemaProps) {
  useEffect(() => {
    // Basic validation
    if (!job) return;

    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description.replace(/<[^>]*>/g, '') + "\n\nRequirements:\n" + job.requirements.join("\n"),
      "identifier": {
        "@type": "PropertyValue",
        "name": job.hiringOrganization.name,
        "value": job.id
      },
      "datePosted": job.postedDate,
      "validThrough": job.validThrough,
      "employmentType": job.type.toUpperCase().replace('-', '_'), // SCHEMA.ORG likes FULL_TIME
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.hiringOrganization.name,
        "sameAs": job.hiringOrganization.sameAs,
        "logo": job.hiringOrganization.logo
      },
      "experienceRequirements": job.experienceRequirements,
      "educationRequirements": job.educationRequirements,
      "baseSalary": job.salary ? {
        "@type": "MonetaryAmount",
        "currency": job.salary.currency,
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salary.min,
          "maxValue": job.salary.max,
          "unitText": job.salary.period
        }
      } : undefined
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `job-schema-${job.id}`;
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(`job-schema-${job.id}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [job]);

  return null;
}
