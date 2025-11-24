import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import './ManualInput.css';

/**
 * ManualInput Component
 * Allows users to type in math problems manually
 */
const ManualInput = ({ mode, onSubmit, onBack }) => {
  const [problemText, setProblemText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    const trimmed = problemText.trim();

    if (!trimmed) {
      setError('Please enter a math problem');
      return;
    }

    if (trimmed.length < 2) {
      setError('Problem seems too short. Please enter a complete math problem.');
      return;
    }

    setError(null);
    onSubmit({
      type: 'text',
      data: trimmed
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const exampleProblems = [
    '1/2 + 1/4',
    '25 × 4',
    '123 - 45',
    'What is 2/3 of 12?',
    'If I have 5 apples and give away 2, how many do I have left?',
    'Word problems using new math methods'
  ];

  const handleExampleClick = (example) => {
    setProblemText(example);
    setError(null);
  };

  return (
    <div className="manual-input">
      <div className="manual-input-container">
        <header className="manual-input-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2 className="manual-input-title">
            {mode === 'parent' ? 'Parent Coach Mode' : 'Kid-Friendly Mode'}
          </h2>
          <p className="manual-input-subtitle">
            {mode === 'parent'
              ? "We'll translate the new math method behind the problem and give you clear teaching language to use."
              : "Type in the math problem"}
          </p>
        </header>

        <div className="manual-input-content">
          <div className="input-section">
            <label htmlFor="problem-input" className="input-label">
              Math Problem
            </label>
            <textarea
              id="problem-input"
              className="problem-textarea"
              placeholder="e.g., 1/2 + 1/4 or What is 2/3 of 12?"
              value={problemText}
              onChange={(e) => {
                setProblemText(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              rows={4}
            />
            <p className="input-hint">
              {mode === 'parent'
                ? "Type the problem exactly as it appears. We'll explain the new math concept behind it and how to teach it step-by-step."
                : "Type the problem exactly as it appears, or describe it in your own words"}
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="examples-section">
            <h3 className="examples-title">Examples:</h3>
            <div className="examples-list">
              {exampleProblems.map((example, index) => (
                <button
                  key={index}
                  className="example-button"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!problemText.trim()}
          >
            Get Teaching Guidance →
          </button>
        </div>

        <div className="manual-input-footer">
          <p className="footer-tip">
            <InformationCircleIcon className="footer-icon" />
            <span><strong>Pro tip:</strong> Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit quickly</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualInput;
