import { SwalWarning } from '../../lib/swal'

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Step5({ formData, onChange }) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const totalSize = files.reduce((sum, f) => sum + f.size, 0)

    if (totalSize > MAX_BYTES) {
      SwalWarning(
        'Archivos demasiado grandes',
        `El tamaño total es ${formatSize(totalSize)}. El límite es 50 MB. Reduce los archivos seleccionados.`
      )
      e.target.value = ''
      return
    }

    onChange(e)
  }

  const totalSize = formData.files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="step-content">
      <h2 className="section-title"><span>5.</span> Documentos y Evidencia</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-dim)' }}>
        Sube archivos relevantes (Layouts, EHS, Requisitos alta proveedor). Máximo <strong>50 MB</strong> en total.
      </p>

      <div className="upload-area">
        <p>Arrastra archivos aquí o haz clic para seleccionar</p>
        <input type="file" name="files" multiple onChange={handleFiles} />

        {formData.files.length > 0 && (
          <>
            <ul style={{ marginTop: '1rem', textAlign: 'left', color: 'var(--text-dim)' }}>
              {formData.files.map((f, i) => (
                <li key={i} style={{ fontSize: '0.9rem' }}>
                  {f.name} <span style={{ opacity: 0.6 }}>({formatSize(f.size)})</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'right' }}>
              Total: <strong>{formatSize(totalSize)}</strong> / 50 MB
            </p>
          </>
        )}
      </div>
    </div>
  )
}
