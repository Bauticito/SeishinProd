import About from '../components/About';
import MissionVision from '../components/MissionVision';
import SEO from '../components/SEO/SEO';

export default function AboutPage() {
    return (
        <div className="pt-20">
            <SEO
                title="Nosotros | Quiénes Somos"
                description="Conoce a Seishin International: empresa mexicana especializada en Inteligencia Artificial industrial con presencia en Aguascalientes y Guanajuato. Nuestra misión es transformar la manufactura con tecnología de vanguardia."
                keywords="Seishin International empresa, quiénes somos, empresa IA México, misión visión, tecnología industrial Aguascalientes, empresa innovación Guanajuato"
                ogTitle="Sobre Seishin International | Empresa de IA Industrial en México"
                ogDescription="Empresa mexicana de Inteligencia Artificial industrial con presencia en Aguascalientes y Guanajuato. Conoce nuestra misión y valores."
            />
            <About />
            <MissionVision />
        </div>
    );
}
