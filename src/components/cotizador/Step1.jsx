export default function Step1({ formData, onChange }) {
  return (
    <div className="step-content">
      <h2 className="section-title"><span>1.</span> Datos de la Empresa</h2>
      <div className="form-grid">
        <div className="field-group full-width">
          <label htmlFor="company_name">Razón Social *</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            placeholder="Ej. Seishin Solutions S.A. de C.V."
            value={formData.company_name}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="rfc">RFC *</label>
          <input
            type="text"
            id="rfc"
            name="rfc"
            placeholder="ABCD123456XYZ"
            value={formData.rfc}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="cp">Código Postal *</label>
          <input
            type="text"
            id="cp"
            name="cp"
            placeholder="76000"
            maxLength={5}
            value={formData.cp}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="industry">Industria</label>
          <select id="industry" name="industry" value={formData.industry} onChange={onChange}>
            <option value="automotriz">Automotriz</option>
            <option value="logistica">Logística</option>
            <option value="metalmecanica">Metalmecánica</option>
            <option value="servicios">Servicios</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="size">Tamaño Empresa</label>
          <select id="size" name="size" value={formData.size} onChange={onChange}>
            <option value="1-50">1-50 empleados</option>
            <option value="51-200">51-200 empleados</option>
            <option value="201-500">201-500 empleados</option>
            <option value="500+">500+ empleados</option>
          </select>
        </div>

        <div className="field-group full-width">
          <label htmlFor="address">Dirección de Planta / Planta de Servicio *</label>
          <textarea
            id="address"
            name="address"
            rows={2}
            placeholder="Estado, Ciudad, Parque Industrial..."
            value={formData.address}
            onChange={onChange}
            required
          />
        </div>

        <div className="field-group">
          <label>¿Empresa Japonesa / HQ?</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="japanese"
                value="yes"
                checked={formData.japanese === 'yes'}
                onChange={onChange}
              />
              Sí
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="japanese"
                value="no"
                checked={formData.japanese === 'no'}
                onChange={onChange}
              />
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
