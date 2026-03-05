export default function Step3({ formData, onChange }) {
  const { branches } = formData
  const showA = branches.includes('A')
  const showB = branches.includes('B')
  const showGeneric = branches.length === 0 || branches.some(b => ['C', 'D', 'E'].includes(b))

  return (
    <div className="step-content">
      <h2 className="section-title"><span>3.</span> Detalle del Servicio</h2>

      {showA && (
        <div className="branch-section">
          <h3>Outsourcing</h3>
          <div className="form-grid">
            <div className="field-group">
              <label>Tipo de Operación</label>
              <select name="op_type" value={formData.op_type} onChange={onChange}>
                <option value="produccion">Producción</option>
                <option value="almacen">Almacén</option>
                <option value="montacargas">Montacargas</option>
                <option value="inspeccion">Inspección</option>
              </select>
            </div>
            <div className="field-group">
              <label>Supervisión requerida</label>
              <select name="supervision" value={formData.supervision} onChange={onChange}>
                <option value="client">Cliente supervisa</option>
                <option value="seishin_partial">SEISHIN parcial</option>
                <option value="seishin_total">SEISHIN total</option>
              </select>
            </div>
            <div className="field-group full-width">
              <label>Actividades específicas</label>
              <textarea
                name="activities"
                rows={3}
                placeholder="Describe las tareas que realizará el personal..."
                value={formData.activities}
                onChange={onChange}
              />
            </div>
          </div>

          <h3>Cantidad de Personal (Perfiles)</h3>
          <div
            className="form-grid"
            style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}
          >
            <input type="text" name="prof_1" placeholder="Perfil (ej. Operador)" />
            <input type="number" name="qty_1" placeholder="Cantidad" />
            <input type="text" name="shift_1" placeholder="Turno" />
          </div>
        </div>
      )}

      {showB && (
        <div className="branch-section">
          <h3>Inspección de Calidad</h3>
          <div className="form-grid">
            <div className="field-group">
              <label>Tipo de Inspección</label>
              <select name="insp_type" value={formData.insp_type} onChange={onChange}>
                <option value="visual">Visual</option>
                <option value="dimensional">Dimensional</option>
                <option value="sorting">Sorting / Contención</option>
              </select>
            </div>
            <div className="field-group">
              <label>Producto / Parte</label>
              <input
                type="text"
                name="part_name"
                placeholder="Nombre de la parte"
                value={formData.part_name}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      )}

      {showGeneric && (
        <div className="branch-section">
          <div className="field-group full-width">
            <label>Requerimientos Adicionales / Notas</label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Cualquier detalle adicional relevante para la cotización..."
              value={formData.notes}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}
