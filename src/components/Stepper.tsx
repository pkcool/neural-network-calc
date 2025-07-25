import React, { useEffect, useState } from 'react';
import { Step, NNState } from '@/types';
import katex from 'katex';

interface StepperProps {
  step: Step;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onJumpToStep: (stepIndex: number) => void;
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

// Component to render calculation results with LaTeX support
const CalculationResult: React.FC<{ content: string }> = ({ content }) => {
  // Check if the content is wrapped in $$ (LaTeX display mode)
  if (content.trim().startsWith('$$') && content.trim().endsWith('$$')) {
    const latexContent = content.trim().slice(2, -2); // Remove the $$ delimiters
    try {
      // Render as LaTeX in display mode
      const html = katex.renderToString(latexContent, {
        throwOnError: false,
        displayMode: true,
      });
      return <div dangerouslySetInnerHTML={{ __html: html }} className="text-center" />;
    } catch (e) {
      console.error('Error rendering LaTeX:', e);
      return <div>{content}</div>;
    }
  }
  
  // If not LaTeX, render as plain HTML
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

const Stepper: React.FC<StepperProps> = ({ step, stepIndex, totalSteps, onNext, onPrev, onReset, onJumpToStep, nnState }) => {
  const { result } = step.calculation(nnState);
  
  // Jump to the start of backward pass (step 13, index 12)
  const jumpToBackwardPass = () => {
    onJumpToStep(12); // Index 12 is step 13 (0-based)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Step {stepIndex + 1}: {step.title}</h2>
          
          {step.formula && (
            <div className="math-container p-4 bg-gray-50 rounded-lg">
              <KatexComponent formula={step.formula} />
            </div>
          )}

          <div className="calc-box p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-slate-700">Live Calculation</h3>
            <div className="p-4 bg-gray-50 rounded flex justify-center">
              <CalculationResult content={result} />
            </div>
          </div>

          {step.explanation && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Explanation</h3>
              <p className="text-slate-600 leading-relaxed">{step.explanation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed position button bar at the bottom */}
      <div className="stepper-navigation">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={onReset}
              className="button button-secondary flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            {stepIndex < 12 && (
              <button
                onClick={jumpToBackwardPass}
                className="button button-secondary flex items-center gap-1 px-3"
                title="Jump to Backward Pass"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span>Backward_Pass</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={onPrev} 
              disabled={stepIndex === 0} 
              className="button button-secondary"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button 
              onClick={onNext} 
              disabled={stepIndex === totalSteps - 1} 
              className="button button-primary"
            >
              Next
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <span className="text-sm text-slate-500 font-medium min-w-[100px] text-right">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
