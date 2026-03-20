import Hero from '../components/Hero';
import MissionVision from '../components/MissionVision';
import Services from '../components/Services';
import ValueProposition from '../components/ValueProposition';
import Industry40 from '../components/Industry40';
import BrandingHighlight from '../components/BrandingHighlight';
import Contact from '../components/Contact';
import SEO from '../components/SEO/SEO';

export default function Home() {
    return (
        <>
            <SEO
                title="Inteligencia Artificial e Innovación Industrial en México"
                description="Seishin International: empresa líder en IA industrial en México. Ofrecemos inspección de calidad automatizada, logística 4.0, vigilancia inteligente y empleo en Aguascalientes y Guanajuato. Solicita tu cotización."
                keywords="IA industrial México, inspección de calidad automatizada, logística 4.0, Industria 4.0, vigilancia inteligente, automatización industrial, Aguascalientes, Guanajuato"
                ogTitle="Seishin International | IA e Innovación Industrial en México"
                ogDescription="Transformamos la manufactura mexicana con Inteligencia Artificial. Conoce nuestros servicios de inspección, logística y vigilancia inteligente."
            />
            <Hero />
            <MissionVision />
            <Services />
            <ValueProposition />
            <BrandingHighlight />
            <Industry40 />
            <Contact />
        </>
    );
}
