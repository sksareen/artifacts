import React, { useState, lazy, Suspense } from 'react';
import './App.css';
import AppSelector from './AppSelector';

function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [appToRun, setAppToRun] = useState(null);
  const [SelectedAppComponent, setSelectedAppComponent] = useState(null);

  const handleSelectApp = (appName) => {
    setSelectedApp(appName);
  };

  const handleRunApp = () => {
    setAppToRun(selectedApp);
    setSelectedAppComponent(lazy(() => import(`./Artifacts/${selectedApp}`)));
  };

  return (
    <div className="App">
      <h1>Artifact Runner</h1>
      <AppSelector onSelectApp={handleSelectApp} />
      <button onClick={handleRunApp} disabled={!selectedApp}>
        Run
      </button>
      {appToRun && SelectedAppComponent && (
        <div className="app-container">
          <h2>{appToRun}</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <SelectedAppComponent />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default App;
