import React, { useState, useEffect } from 'react';

const AppSelector = ({ onSelectApp }) => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    // In a real scenario, you'd dynamically fetch this list
    setApps(['FantasyBuddy']);
  }, []);

  return (
    <div>
      <select onChange={(e) => onSelectApp(e.target.value)}>
        <option value="">Select an app</option>
        {apps.map((app) => (
          <option key={app} value={app}>
            {app}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AppSelector;
