import React from 'react';
import { CameraIcon, PencilSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import './InputMethod.css';

/**
 * InputMethod Component
 * Allows user to choose between photo upload or manual text entry
 */
const InputMethod = ({ mode, onMethodSelect, onBack }) => {
  return (
    <div className="input-method">
      <div className="input-method-container">
        <header className="input-method-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2 className="input-method-title">
            {mode === 'parent' ? 'Parent Coach Mode' : 'Kid-Friendly Mode'}
          </h2>
          <p className="input-method-subtitle">How would you like to share the problem?</p>
        </header>

        <div className="input-method-content">
          <div className="method-buttons">
            <button
              className="method-button method-button-photo"
              onClick={() => onMethodSelect('photo')}
            >
              <CameraIcon className="method-icon" />
              <div className="method-text">
                <h3>Take a Photo</h3>
                <p>Snap a picture of the homework</p>
              </div>
            </button>

            <div className="method-divider">
              <span>or</span>
            </div>

            <button
              className="method-button method-button-text"
              onClick={() => onMethodSelect('text')}
            >
              <PencilSquareIcon className="method-icon" />
              <div className="method-text">
                <h3>Type It In</h3>
                <p>Enter the problem manually</p>
              </div>
            </button>
          </div>

          <div className="input-method-tip">
            <p>
              <InformationCircleIcon className="tip-icon" />
              <span><strong>Tip:</strong> Typing is more reliable, but photos work great for problems with diagrams!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputMethod;
