import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO/SEO';

const MissionVision = lazy(() => import('../components/MissionVision'));
const Services = lazy(() => import('../components/Services'));
const ValueProposition = lazy(() => import('../components/ValueProposition'));
const Industry40 = lazy(() => import('../components/Industry40'));
const BrandingHighlight = lazy(() => import('../components/BrandingHighlight'));
const Contact = lazy(() => import('../components/Contact'));

function SectionFallback() {
  return <div className="min-h-[20vh] bg-[var(--bg-primary)]" />;
}

export default function Home() {
  return (
    <>
      <SEO
        title="Inteligencia Artificial e InnovaciÃ³n Industrial en MÃ©xico"
        description="Seishin International: empresa lÃ­der en IA industrial en MÃ©xico. Ofrecemos inspecciÃ³n de calidad automatizada, logÃ­stica 4.0, vigilancia inteligente y empleo en Aguascalientes y Guanajuato. Solicita tu cotizaciÃ³n."
        keywords="IA industrial MÃ©xico, inspecciÃ³n de calidad automatizada, logÃ­stica 4.0, Industria 4.0, vigilancia inteligente, automatizaciÃ³n industrial, Aguascalientes, Guanajuato"
        ogTitle="Seishin International | IA e InnovaciÃ³n Industrial en MÃ©xico"
        ogDescription="Transformamos la manufactura mexicana con Inteligencia Artificial. Conoce nuestros servicios de inspecciÃ³n, logÃ­stica y vigilancia inteligente."
      />
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <MissionVision />
        <Services />
        <ValueProposition />
        <BrandingHighlight />
        <Industry40 />
        <Contact />
      </Suspense>
    </>
  );
}
