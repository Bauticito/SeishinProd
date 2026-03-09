const SERVICES = [
  { value: 'outsourcing_op',  label: 'Servicio especializado Operativo',         branch: 'A' },
  { value: 'outsourcing_adm', label: 'Servicio especializado Administrativo',    branch: 'A' },
  { value: 'inspeccion',      label: 'Inspección de Calidad',         branch: 'B' },
  { value: 'traduccion',      label: 'Traducción (Evento/Planta)',     branch: 'C' },
  { value: 'consultoria',     label: 'Consultoría LFT/SAT/REPSE',     branch: 'C' },
  { value: 'reclutamiento',   label: 'Reclutamiento y Selección',     branch: 'D' },
  { value: 'transporte',      label: 'Transporte de Personal',        branch: 'E' },
  { value: 'servicios_de_IA', label: 'Servicios de IA',              branch: 'F' },
  { value: 'otros',           label: 'Otros (especificar)',           branch: null },
]

export default function Step0({ formData, onChange }) {
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  const minDate = today.toISOString().split('T')[0]

  return (
    <div className="step-content">
      <h2 className="section-title"><span>0.</span> ¿Qué necesitas?</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>
        Selecciona uno o varios servicios para personalizar los siguientes pasos.
      </p>

      <div className="service-options">
        {SERVICES.map(({ value, label }) => (
          <label
            key={value}
            className={`service-card${formData.services.includes(value) ? ' selected' : ''}`}
          >
            <input
              type="checkbox"
              name="services"
              value={value}
              checked={formData.services.includes(value)}
              onChange={onChange}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {formData.services.includes('otros') && (
        <div className="field-group" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="otros_descripcion">Especifica el servicio que necesitas *</label>
          <input
            type="text"
            id="otros_descripcion"
            name="otros_descripcion"
            value={formData.otros_descripcion || ''}
            onChange={onChange}
            placeholder="Describe brevemente el servicio..."
            maxLength={120}
            required
          />
        </div>
      )}

      <div className="form-grid" style={{ marginTop: '2rem' }}>
        <div className="field-group">
          <label htmlFor="start_date">Fecha estimada de inicio</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={onChange}
            min={minDate}
            required
          />
        </div>
        <div className="field-group">
          <label htmlFor="urgency">Nivel de Urgencia</label>
          <select id="urgency" name="urgency" value={formData.urgency} onChange={onChange}>
            <option value="low">Solo cotización (Planeación)</option>
            <option value="medium">Media (15-30 días)</option>
            <option value="high">Alta (Inmediato)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
