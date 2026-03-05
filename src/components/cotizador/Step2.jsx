export default function Step2({ formData, onChange }) {
  return (
    <div className="step-content">
      <h2 className="section-title"><span>2.</span> Contacto y Canal de Cotización</h2>
      <div className="form-grid">
        <div className="field-group full-width">
          <label htmlFor="contact_name">Nombre Completo *</label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            placeholder="Tu nombre"
            value={formData.contact_name}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="position">Cargo *</label>
          <select id="position" name="position" value={formData.position} onChange={onChange} required>
            <option value="rh">Recursos Humanos</option>
            <option value="ops">Operaciones</option>
            <option value="compras">Compras</option>
            <option value="fins">Finanzas</option>
            <option value="dirs">Directivo</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="email">Email Corporativo *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@empresa.com"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="10 dígitos"
            value={formData.phone}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="preferred_channel">¿Canal preferido para cotización?</label>
          <select id="preferred_channel" name="preferred_channel" value={formData.preferred_channel} onChange={onChange}>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="both">Ambos</option>
          </select>
        </div>

        <div
          className="field-group full-width"
          style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}
        >
          <label htmlFor="approver">Autorizador / Decisor (si es diferente)</label>
          <input
            type="text"
            id="approver"
            name="approver"
            placeholder="Nombre y Cargo del autorizador"
            value={formData.approver}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}
