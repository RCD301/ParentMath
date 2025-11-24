import React, { useState } from 'react';
import Landing from './components/Landing';
import Results from './components/Results';
import './App.css';

/**
 * Main App Component
 * Manages the application state and routing between different views
 */
function App() {
  // State management
  const [currentView, setCurrentView] = useState('landing'); // landing, results
  const [inputData, setInputData] = useState(null); // Data from Landing component (includes mode, type, data)
  const [preservedState, setPreservedState] = useState(null); // Preserve mode and method when resetting

  // Navigation handlers
  const handleInputSubmit = (data) => {
    // data includes: { mode, type, data, mediaType?, preview? }
    setInputData(data);
    // Preserve mode and input method for when user wants to try another problem
    setPreservedState({
      mode: data.mode,
      method: data.type === 'image' ? 'photo' : 'text'
    });
    setCurrentView('results');
  };

  const handleReset = () => {
    // Don't clear preservedState - keep mode and method for next problem
    setInputData(null);
    setCurrentView('landing');
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onSubmit={handleInputSubmit} preservedState={preservedState} />;

      case 'results':
        return (
          <Results
            mode={inputData.mode}
            inputData={inputData}
            onReset={handleReset}
          />
        );

      default:
        return <Landing onSubmit={handleInputSubmit} preservedState={preservedState} />;
    }
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
}

export default App;
