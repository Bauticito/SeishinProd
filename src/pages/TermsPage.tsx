export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2">
          Términos de <span className="text-[#E31E24]">Uso</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mb-10">Última actualización: marzo 2026</p>

        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar el sitio web de <strong className="text-[var(--text-primary)]">Seishin</strong>,
              usted acepta quedar vinculado por los presentes Términos de Uso. Si no está de acuerdo con
              alguno de estos términos, le pedimos abstenerse de usar el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">2. Uso del sitio</h2>
            <p>El usuario se compromete a utilizar el sitio web únicamente con fines lícitos y de acuerdo con:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>La legislación vigente en México</li>
              <li>Los presentes términos y condiciones</li>
              <li>Las buenas prácticas de uso de internet</li>
            </ul>
            <p className="mt-2">
              Queda prohibido el uso del sitio para actividades ilícitas, fraudulentas o que perjudiquen
              los derechos de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">3. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del sitio —incluyendo textos, imágenes, logotipos, íconos, software y
              diseño— son propiedad de Seishin o de sus respectivos titulares y están protegidos por las
              leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin
              autorización expresa por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">4. Cotizaciones y propuestas</h2>
            <p>
              Las cotizaciones generadas a través del cotizador en línea son estimaciones referenciales.
              Los precios definitivos se confirman tras un diagnóstico personalizado por parte del equipo
              de Seishin. Ninguna cotización automática constituye un contrato u oferta vinculante.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">5. Limitación de responsabilidad</h2>
            <p>
              Seishin no será responsable por daños directos, indirectos, incidentales o consecuentes
              derivados del uso o la imposibilidad de uso del sitio, incluyendo interrupciones del servicio
              o errores en la información publicada.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">6. Modificaciones</h2>
            <p>
              Seishin se reserva el derecho de modificar estos Términos de Uso en cualquier momento.
              El uso continuado del sitio tras la publicación de cambios implica la aceptación de los
              nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">7. Ley aplicable y jurisdicción</h2>
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
              controversia derivada de los mismos será sometida a la jurisdicción de los tribunales
              competentes de la ciudad de Aguascalientes, México.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">8. Contacto</h2>
            <p>
              Para cualquier duda relacionada con estos términos, contáctenos en{' '}
              <a href="mailto:fabian.noel@seishin.com.mx" className="text-[#E31E24] hover:underline">
                fabian.noel@seishin.com.mx
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
