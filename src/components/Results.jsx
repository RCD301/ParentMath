import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { analyzeMathProblemText, analyzeMathProblemImage } from '../services/anthropicService';
import { LoginPanel } from './LoginPanel';
import { PaywallModal } from './PaywallModal';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, consumeUse, hasProAccess, canUseFree } from '../lib/usageService';
import './Results.css';

/**
 * Results Component
 * Displays the AI-generated teaching guidance
 */
const Results = ({ mode, inputData, onReset }) => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [usesRemaining, setUsesRemaining] = useState(5);

  useEffect(() => {
    const analyzePromise = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check usage limits before analyzing
        if (!user) {
          setError('Please sign in to continue');
          setLoading(false);
          return;
        }

        const profile = await getUserProfile(user.uid);
        if (!profile) {
          setError('Unable to load user profile');
          setLoading(false);
          return;
        }

        const isPro = hasProAccess(profile);
        const canUse = canUseFree(profile);

        if (!isPro && !canUse) {
          // Show paywall
          setUsesRemaining(5 - profile.freeUsesUsed);
          setShowPaywall(true);
          setLoading(false);
          return;
        }

        // Consume a use before proceeding
        await consumeUse(user.uid);

        let guidance;

        if (inputData.type === 'text') {
          guidance = await analyzeMathProblemText(inputData.data, mode);
        } else if (inputData.type === 'image') {
          guidance = await analyzeMathProblemImage(
            inputData.data,
            inputData.mediaType,
            mode
          );
        }

        setResult(guidance);
      } catch (err) {
        console.error('Analysis error:', err);
        setError(
          err.message || 'Failed to analyze the problem. Please try again or check your API key.'
        );
      } finally {
        setLoading(false);
      }
    };

    analyzePromise();
  }, [inputData, mode, user]);

  const formatMarkdown = (text) => {
    // Split into paragraphs and format markdown (for Kid mode)
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return null;

      // Headers (lines starting with ##, ###, etc.)
      if (line.match(/^#{1,3}\s/)) {
        const level = line.match(/^#{1,3}/)[0].length;
        const text = line.replace(/^#{1,3}\s/, '');
        return React.createElement(
          `h${level + 2}`,
          { key: index, className: 'result-heading' },
          text
        );
      }

      // Bold text (**text**)
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="result-paragraph">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }

      // List items (lines starting with - or *)
      if (line.match(/^[\-\*]\s/)) {
        return (
          <li key={index} className="result-list-item">
            {line.replace(/^[\-\*]\s/, '')}
          </li>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="result-paragraph">
          {line}
        </p>
      );
    });
  };

  const renderJSON = (jsonData) => {
    // Render structured JSON output (for Parent mode)
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

      return (
        <div className="json-guidance">
          {/* Problem Section */}
          <div className="json-section problem-section">
            <h3 className="result-heading">PROBLEM</h3>
            <p className="result-paragraph">{data.teaching.problem_restatement}</p>
          </div>

          {/* New Math Method Section */}
          {data.teaching.new_math_method && (
            <div className="json-section method-section">
              <h3 className="result-heading">NEW MATH METHOD</h3>
              <p className="result-paragraph">
                <strong>{data.teaching.new_math_method.name}</strong>
              </p>
              <p className="result-paragraph method-explanation">
                {data.teaching.new_math_method.explanation}
              </p>
            </div>
          )}

          {/* Teach It Section */}
          <div className="json-section teaching-section">
            <h3 className="result-heading">TEACH IT</h3>
            {data.teaching.steps.map((step, index) => (
              <div key={index} className="teaching-step">
                <p className="result-paragraph">
                  <strong>{step.title}</strong>
                </p>
                <p className="result-paragraph">
                  <strong>Say this:</strong> "{step.say_this}"
                </p>
                {step.instruction && (
                  <p className="result-paragraph instruction-text">
                    {step.instruction}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Visual Hint (if present) */}
          {data.teaching.visual_hint && (
            <div className="json-section visual-hint-section">
              <pre className="visual-hint">{data.teaching.visual_hint}</pre>
            </div>
          )}

          {/* Quick Notes Section */}
          <div className="json-section notes-section">
            <h3 className="result-heading">QUICK NOTES</h3>
            <ul className="notes-list">
              <li className="result-list-item">
                <strong>Concept:</strong> {data.teaching.quick_notes.concept}
              </li>
              <li className="result-list-item">
                <strong>Common mistake:</strong> {data.teaching.quick_notes.common_mistake}
              </li>
              <li className="result-list-item">
                <strong>If they ask:</strong> {data.teaching.quick_notes.if_they_ask}
              </li>
            </ul>
          </div>

          {/* Answer Section */}
          <div className="json-section answer-section">
            <h3 className="result-heading">ANSWER</h3>
            <p className="result-paragraph">
              <strong>{data.answer.expression} = {data.answer.value}</strong>
            </p>
          </div>

          {/* Problem Analysis Details (collapsible) */}
          <details className="problem-analysis">
            <summary className="analysis-summary">Why this method works</summary>
            <div className="analysis-content">
              <p><strong>What we're doing:</strong> {data.parsed.operation}</p>
              <p><strong>Why:</strong> {data.parsed.operation_why}</p>
              <p><strong>What kind of problem this is:</strong> {data.parsed.problem_type.replace(/_/g, ' ')}</p>
              <p><strong>What we're trying to find:</strong> {data.parsed.unknown}</p>
              {data.parsed.unit && <p><strong>Unit:</strong> {data.parsed.unit}</p>}
              <p className="parent-tip"><strong>Parent tip:</strong> You can use this same idea to solve similar problems. Look for the pattern and repeat it.</p>
            </div>
          </details>
        </div>
      );
    } catch (err) {
      console.error('JSON parse error:', err);
      // Fallback to markdown rendering if JSON parsing fails
      return formatMarkdown(jsonData);
    }
  };

  return (
    <div className="results">
      <div className="results-container app-card-shell">
        {/* Paywall In-Card Overlay */}
        {showPaywall && (
          <PaywallModal
            onClose={() => {
              setShowPaywall(false);
              onReset();
            }}
            usesRemaining={usesRemaining}
          />
        )}

        {/* Card Header with Login */}
        <div className="card-header">
          <LoginPanel />
        </div>

        <header className="results-header">
          <h2 className="results-title">
            {mode === 'parent' ? 'Teaching Guidance' : 'Let\'s Learn Together!'}
          </h2>
          <p className="results-subtitle">
            {mode === 'parent'
              ? 'Here\'s how to explain this to your child'
              : 'Read this explanation with your child'}
          </p>
        </header>

        <div className="results-content">
          {/* Show original problem if available */}
          {inputData.type === 'text' && (
            <div className="problem-display">
              <h3>Problem:</h3>
              <div className="problem-text">{inputData.data}</div>
            </div>
          )}

          {inputData.type === 'image' && inputData.preview && (
            <div className="problem-display">
              <h3>Problem:</h3>
              <div className="problem-image-container">
                <img src={inputData.preview} alt="Math problem" className="problem-image" />
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing the problem and preparing guidance...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="error-state">
              <ExclamationTriangleIcon className="error-icon" />
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="button button-primary" onClick={onReset}>
                Try Another Problem
              </button>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="guidance-content">
              <div className={`guidance-text mode-${mode}`}>
                {mode === 'parent' ? renderJSON(result) : formatMarkdown(result)}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!loading && !error && (
          <div className="results-footer">
            <button className="button button-primary" onClick={onReset}>
              Try Another Problem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
