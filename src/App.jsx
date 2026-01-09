import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Results from './components/Results';
import Pricing from './components/Pricing';
import HelpYourChild from './components/HelpYourChild';
import './App.css';

/**
 * Main App Component
 * Manages the application state and routing between different views
 */
function App() {
  // State management
  const [currentView, setCurrentView] = useState('landing'); // landing, results, pricing, help
  const [inputData, setInputData] = useState(null); // Data from Landing component (includes mode, type, data)
  const [preservedState, setPreservedState] = useState(null); // Preserve mode and method when resetting

  // Simple client-side routing based on URL path
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/pricing') {
        setCurrentView('pricing');
      } else if (path === '/help-your-child-with-math-homework') {
        setCurrentView('help');
      } else if (currentView === 'pricing' || currentView === 'help') {
        // If we navigate away from pricing or help, go back to landing
        setCurrentView('landing');
      }
    };

    // Handle initial route and popstate (back/forward)
    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [currentView]);

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
      case 'help':
        return <HelpYourChild />;

      case 'pricing':
        return <Pricing />;

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
