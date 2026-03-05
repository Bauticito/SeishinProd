export default function Step5({ formData, onChange }) {
  return (
    <div className="step-content">
      <h2 className="section-title"><span>5.</span> Documentos y Evidencia</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>
        Sube archivos relevantes (Layouts, EHS, Requisitos alta proveedor).
      </p>
      <div className="upload-area">
        <p>Arrastra archivos aquí o haz clic para seleccionar</p>
        <input type="file" name="files" multiple onChange={onChange} />
        {formData.files.length > 0 && (
          <ul style={{ marginTop: '1rem', textAlign: 'left', color: 'var(--text-dim)' }}>
            {formData.files.map((f, i) => (
              <li key={i} style={{ fontSize: '0.9rem' }}>{f.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
