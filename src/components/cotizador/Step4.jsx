export default function Step4({ formData, onChange }) {
  return (
    <div className="step-content">
      <h2 className="section-title"><span>4.</span> Condiciones y Facturación</h2>
      <div className="form-grid">
        <div className="field-group">
          <label>¿Requiere Orden de Compra (OC)?</label>
          <select name="requires_po" value={formData.requires_po} onChange={onChange}>
            <option value="yes">Sí</option>
            <option value="no">No</option>
            <option value="unknown">No sé</option>
          </select>
        </div>

        <div className="field-group">
          <label>Plazo de Pago (Días)</label>
          <select name="payment_terms" value={formData.payment_terms} onChange={onChange}>
            <option value="7">7 días</option>
            <option value="15">15 días</option>
            <option value="30">30 días</option>
            <option value="45+">45+ días</option>
          </select>
        </div>

        <div className="field-group">
          <label>Frecuencia Facturación</label>
          <select name="billing_freq" value={formData.billing_freq} onChange={onChange}>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quincenal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>

        <div className="field-group">
          <label>Moneda</label>
          <select name="currency" value={formData.currency} onChange={onChange}>
            <option value="mxn">MXN</option>
            <option value="usd">USD</option>
          </select>
        </div>
      </div>
    </div>
  )
}
