import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KatexComponentProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export const KatexComponent: React.FC<KatexComponentProps> = ({ 
  formula, 
  displayMode = false,
  className = ''
}) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      setHtml(katex.renderToString(formula, {
        throwOnError: false,
        displayMode,
        output: 'html',
        strict: false
      }));
    } catch (e) {
      console.error('Error rendering LaTeX:', e);
      setHtml(formula);
    }
  }, [formula, displayMode]);

  return <span 
    className={`katex-rendered ${className}`} 
    dangerouslySetInnerHTML={{ __html: html }} 
  />;
};

export default KatexComponent;
