export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2">
          Aviso de <span className="text-[#E31E24]">Privacidad</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mb-10">Última actualización: marzo 2026</p>

        <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">1. Responsable del tratamiento</h2>
            <p>
              <strong className="text-[var(--text-primary)]">Seishin</strong> (en adelante "la empresa") es responsable del
              tratamiento de sus datos personales. Para cualquier consulta relacionada con este aviso puede
              contactarnos en{' '}
              <a href="mailto:info@seishin.com.mx" className="text-[#E31E24] hover:underline">
                info@seishin.com.mx
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">2. Datos personales que recabamos</h2>
            <p>A través de nuestro sitio web y formularios de contacto recabamos los siguientes datos:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Teléfono (opcional)</li>
              <li>Nombre de empresa (opcional)</li>
              <li>Mensaje o descripción del proyecto</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">3. Finalidades del tratamiento</h2>
            <p>Sus datos personales son utilizados para las siguientes finalidades:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Atender solicitudes de cotización y contacto</li>
              <li>Dar seguimiento comercial a propuestas enviadas</li>
              <li>Gestionar la relación con clientes y prospectos</li>
              <li>Cumplir obligaciones legales y contractuales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">4. Transferencia de datos</h2>
            <p>
              Sus datos no serán transferidos a terceros sin su consentimiento, salvo en los casos previstos
              por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)
              y su Reglamento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">5. Derechos ARCO</h2>
            <p>
              Usted tiene derecho a <strong className="text-[var(--text-primary)]">Acceder, Rectificar, Cancelar u Oponerse</strong> al
              tratamiento de sus datos personales (derechos ARCO). Para ejercerlos, envíe un correo a{' '}
              <a href="mailto:info@seishin.com.mx" className="text-[#E31E24] hover:underline">
                info@seishin.com.mx
              </a>{' '}
              indicando su nombre completo y la solicitud específica.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">6. Cookies y tecnologías de rastreo</h2>
            <p>
              Nuestro sitio puede utilizar cookies técnicas para el correcto funcionamiento de la plataforma.
              No utilizamos cookies de rastreo publicitario de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">7. Cambios al aviso de privacidad</h2>
            <p>
              Seishin se reserva el derecho de modificar este aviso en cualquier momento. Las modificaciones
              serán publicadas en esta misma página con la fecha de actualización correspondiente.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
