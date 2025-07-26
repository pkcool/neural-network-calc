"use client";

import { useState } from 'react';
import ClientOnly from '@/components/ClientOnly';
import NeuralNetworkDiagram from "@/components/NeuralNetworkDiagram";
import Stepper from "@/components/Stepper";
import SummaryChart from "@/components/SummaryChart";
import { steps } from '@/lib/steps';
import { INITIAL_STATE } from '@/lib/constants';
import { NNState } from '@/types';

export default function Home() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [nnState, setNnState] = useState<NNState>(INITIAL_STATE);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      const { newState } = nextStep.calculation(nnState);
      setNnState(newState);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      // This is a simplified version. A more robust implementation would re-calculate previous states.
      // For now, we just go back to the previous step's view without reverting the state change.
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const jumpToStep = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < steps.length) {
      // Calculate the state by applying all steps up to the target index
      let currentState = INITIAL_STATE;
      for (let i = 0; i <= targetIndex; i++) {
        const { newState } = steps[i].calculation(currentState);
        currentState = newState;
      }
      setNnState(currentState);
      setCurrentStepIndex(targetIndex);
    }
  };

  const handleReset = () => {
    setNnState(INITIAL_STATE);
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-4 bg-white border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Interactive Backpropagation</h1>
        <p className="text-slate-600">An interactive, step-by-step walkthrough of how a neural network learns.</p>
      </header>

      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <ClientOnly>
            {/* Neural Network Diagram - Fixed height container */}
            <div className="w-1/2 h-[calc(100vh-200px)] overflow-auto p-4 bg-white">
              <NeuralNetworkDiagram 
                nnState={nnState} 
                highlight={currentStep.highlight} 
                className="h-full"
              />
            </div>
            
            {/* Stepper - Fixed height container with scroll */}
            <div className="w-1/2 h-[calc(100vh-200px)] overflow-y-auto p-4 bg-white border-l border-slate-200">
              <Stepper 
                step={currentStep} 
                stepIndex={currentStepIndex} 
                totalSteps={steps.length} 
                onNext={handleNext} 
                onPrev={handlePrev} 
                onReset={handleReset}
                onJumpToStep={jumpToStep}
                nnState={nnState}
              />
            </div>
          </ClientOnly>
        </div>

        <div className="border-t border-slate-200 p-4 bg-white">
          <ClientOnly>
            <SummaryChart nnState={nnState} />
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
