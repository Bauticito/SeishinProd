import { useState } from 'react'

const SHIFT_TIMES = [
  { label: 'Turno 1', hours: '9:00 am – 5:00 pm' },
  { label: 'Turno 2', hours: '5:00 pm – 1:00 am' },
  { label: 'Turno 3', hours: '1:00 am – 9:00 am' },
]

export default function Step3({ formData, onChange }) {
  const { branches } = formData
  const showA = branches.includes('A')
  const showB = branches.includes('B')
  const showGeneric = branches.length === 0 || branches.some(b => ['C', 'D', 'E'].includes(b))
  const [numTurnos, setNumTurnos] = useState(1)

  return (
    <div className="step-content">
      <h2 className="section-title"><span>3.</span> Detalle del Servicio</h2>

      {showA && (
        <div className="branch-section">
          <h3>Servicio especializado</h3>
          <div className="form-grid">
            <div className="field-group">
              <label>Tipo de Operación</label>
              <select name="op_type" value={formData.op_type} onChange={onChange}>
                <option value="produccion">Producción</option>
                <option value="retrabajo">Retrabajo</option>
                <option value="almacenista">Almacenista</option>
                <option value="patinero">Patinero</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="facturista">Facturista</option>
                <option value="soldador">Soldador</option>
                <option value="sorteo">Sorteo</option>
                <option value="inspector_visual">Inspector visual</option>
                <option value="servicios_generales">Servicios generales</option>
                <option value="mantenimiento_edificio">Mantenimiento de edificio</option>
                <option value="vigilante">Vigilante</option>
                <option value="ayudante_produccion">Ayudante de producción</option>
                <option value="empacador">Empacador</option>
                <option value="limpieza">Limpieza</option>
                <option value="picking">Picking</option>
                <option value="montacarguista">Montacarguista</option>
                <option value="gruista">Gruista</option>
                <option value="operador_torno">Operadores de torno</option>
                <option value="supervisor">Supervisor</option>
                <option value="chofer">Chofer</option>
                <option value="jardinero">Jardinero</option>
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

          <h3 style={{ marginTop: '2rem' }}>Cantidad de Personal (Perfiles)</h3>

          {/* Turno selector + descriptions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div className="field-group" style={{ minWidth: '160px', flex: '0 0 auto' }}>
              <label>Número de Turnos</label>
              <select
                value={numTurnos}
                onChange={e => setNumTurnos(Number(e.target.value))}
              >
                <option value={1}>1 turno</option>
                <option value={2}>2 turnos</option>
                <option value={3}>3 turnos</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '1.75rem' }}>
              {SHIFT_TIMES.slice(0, numTurnos).map(({ label, hours }) => (
                <span key={label} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: '0.4rem' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>{label}:</strong> {hours}
                </span>
              ))}
            </div>
          </div>

          {/* Profile rows — one per turno */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {Array.from({ length: numTurnos }, (_, i) => (
              <div
                key={i}
                className="form-grid"
                style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '12px', alignItems: 'center' }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', gridColumn: '1 / -1', marginBottom: '-0.25rem' }}>
                  {SHIFT_TIMES[i].label} · {SHIFT_TIMES[i].hours}
                </span>
                <input type="text" name={`prof_${i + 1}`} placeholder="Perfil (ej. Operador)" />
                <input type="number" name={`qty_${i + 1}`} placeholder="Cantidad" min={1} />
              </div>
            ))}
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
