import React from 'react';
import { Check } from 'lucide-react';

export default function StepWizard({ steps, currentStep }) {
  return (
    <div className="step-wizard" role="navigation" aria-label="Form progress">
      {steps.map((step, idx) => {
        const num      = idx + 1;
        const isActive = num === currentStep;
        const isDone   = num < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="wizard-step">
              <div
                className={`wizard-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${num}: ${step.label} — ${isDone ? 'completed' : isActive ? 'current' : 'upcoming'}`}
              >
                {isDone ? <Check size={14} /> : num}
              </div>
              <span className={`wizard-step-label ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`wizard-connector ${isDone ? 'done' : ''}`} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
