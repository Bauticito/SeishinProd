import { useState } from 'react'
import { validateRazonSocial, validateRFC, filterRFC } from '../../lib/formValidation'

const emptyErrors = { company_name: '', rfc: '', cp: '', address: '' }

export default function Step1({ formData, onChange }) {
  const [errors, setErrors] = useState(emptyErrors)

  const validate = (name, value) => {
    if (name === 'company_name') return validateRazonSocial(value)
    if (name === 'rfc')          return validateRFC(value)
    if (name === 'cp')           return /^\d{5}$/.test(value.trim()) ? '' : 'Debe tener exactamente 5 dígitos'
    if (name === 'address')      return value.trim() ? '' : 'La dirección es requerida'
    return ''
  }

  const handleChange = (e) => {
    const { name } = e.target
    let value = e.target.value

    // RFC: forzar mayúsculas y filtrar caracteres inválidos
    if (name === 'rfc') {
      value = filterRFC(value)
      // Crear evento sintético con el valor filtrado
      const syntheticEvent = { ...e, target: { ...e.target, name, value } }
      onChange(syntheticEvent)
      setErrors(prev => ({ ...prev, rfc: validateRFC(value) }))
      return
    }

    onChange(e)
    if (name in emptyErrors) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
    }
  }

  const err = (field) => errors[field]
    ? <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors[field]}</p>
    : null

  const inputClass = (field) =>
    errors[field] ? 'input-error' : ''

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
            onChange={handleChange}
            maxLength={40}
            className={inputClass('company_name')}
            required
          />
          {err('company_name')}
        </div>

        <div className="field-group">
          <label htmlFor="rfc">RFC *</label>
          <input
            type="text"
            id="rfc"
            name="rfc"
            placeholder="ABCD123456XYZ"
            value={formData.rfc}
            onChange={handleChange}
            maxLength={13}
            className={inputClass('rfc')}
            style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
            required
          />
          {err('rfc')}
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
            onChange={handleChange}
            className={inputClass('cp')}
            required
          />
          {err('cp')}
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
            onChange={handleChange}
            className={inputClass('address')}
            required
          />
          {err('address')}
        </div>

        <div className="field-group">
          <label>¿EMPRESA QUE REPORTA A UN HEAD QUARTER?</label>
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
