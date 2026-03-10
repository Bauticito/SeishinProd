const SERVICE_LABELS = {
  outsourcing_op:  'Servicio especializado Operativo',
  outsourcing_adm: 'Servicio especializado Administrativo',
  reclutamiento:   'Reclutamiento y Selección',
  payroll:         'Nómina',
  otros:           'Otros',
}

export default function Step6({ formData, onChange }) {
  const { company_name, contact_name, services, rfc, email } = formData
  const serviceLabels = services.map(s => SERVICE_LABELS[s] || s)

  return (
    <div className="step-content">
      <h2 className="section-title"><span>6.</span> Resumen y Envío</h2>

      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
        }}
      >
        <div className="summary-grid">
          <div><strong>Empresa:</strong> {company_name || 'N/A'}</div>
          <div><strong>Contacto:</strong> {contact_name || 'N/A'}</div>
          <div className="full-width">
            <strong>Servicios:</strong> {serviceLabels.length > 0 ? serviceLabels.join(', ') : 'Ninguno'}
          </div>
          <div><strong>RFC:</strong> {rfc || 'N/A'}</div>
          <div><strong>Email:</strong> {email || 'N/A'}</div>
        </div>
      </div>

      <div className="field-group">
        <label className="radio-label" style={{ color: 'var(--text-white)' }}>
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={onChange}
            required
          />
          Confirmo que la información proporcionada es verídica y autorizo el contacto para seguimiento.
        </label>
      </div>
    </div>
  )
}
