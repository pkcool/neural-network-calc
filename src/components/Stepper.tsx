import React, { useEffect, useState } from 'react';
import { Step, NNState } from '@/types';
import katex from 'katex';

interface StepperProps {
  step: Step;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  nnState: NNState;
}

const KatexComponent: React.FC<{ formula: string }> = ({ formula }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      // Strip $$ delimiters if present
      const cleaned = formula.replace(/^\$\$|\$\$$/g, '').trim();
      setHtml(katex.renderToString(cleaned, {
        throwOnError: false,
        displayMode: true,
      }));
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setHtml(`<p class="text-red-500">Error rendering math: ${e.message}</p>`);
      } else {
        setHtml(`<p class="text-red-500">An unknown error occurred during math rendering.</p>`);
      }
    }
  }, [formula]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const Stepper: React.FC<StepperProps> = ({ step, stepIndex, totalSteps, onNext, onPrev, nnState }) => {
  const { result } = step.calculation(nnState);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div id="explanation-container" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Step {stepIndex + 1}: {step.title}</h2>
            <p className="text-slate-700 leading-relaxed">{step.explanation}</p>
            {step.formula && (
              <div className="math-container">
                <KatexComponent formula={step.formula} />
              </div>
            )}
          </div>
          <div id="calculation-container" className="calc-box">
            <h3 className="calc-title">Live Calculation</h3>
            <div className="calc-value" dangerouslySetInnerHTML={{ __html: result }}></div>
          </div>
        </div>
      </div>

      {/* Fixed position button bar at the bottom */}
      <div className="stepper-navigation">
        <div className="flex justify-between items-center">
          <button 
            onClick={onPrev} 
            disabled={stepIndex === 0} 
            className="button button-secondary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <span className="text-sm text-slate-500 font-medium">
            Step {stepIndex + 1} of {totalSteps}
          </span>
          
          <button 
            onClick={onNext} 
            disabled={stepIndex === totalSteps - 1} 
            className="button button-primary"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
