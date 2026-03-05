export default function WizardProgress({ currentStep, totalSteps }) {
  const progressPercent = (currentStep / totalSteps) * 100

  return (
    <div className="wizard-progress">
      <div className="progress-line" style={{ width: `${progressPercent}%` }} />
      {Array.from({ length: totalSteps + 1 }, (_, i) => (
        <div
          key={i}
          className={[
            'step-node',
            i === currentStep ? 'active' : '',
            i < currentStep ? 'completed' : '',
          ].join(' ').trim()}
        >
          {i}
        </div>
      ))}
    </div>
  )
}
