// src/components/ChatInterface.js

import React, { useState, useCallback, useEffect } from 'react';
import { generateApp } from '../services/appGenerator';
import { checkServerHealth } from '../services/claudeService';
import AppPreview from './AppPreview';
// import { validateInput } from '../utils/validation';
import { saveApp, getShareableLink } from '../utils/appStorage';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modifications, setModifications] = useState([]);
  const [appId, setAppId] = useState(null);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [retries, setRetries] = useState(0);
  const [appDescription, setAppDescription] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkServerHealth();
        setServerStatus(isHealthy ? 'Connected' : 'Disconnected');
      } catch (error) {
        console.error('Error checking server health:', error);
        setServerStatus('Error connecting to server');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // what is the 'e' for?
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setGeneratedCode('');
    
    try {
      console.log('Sending request to server...');
      const response = await fetch('http://localhost:5001/api/generate-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.text(); // Change this line?
      console.log('Data received, code length:', data.length);
      setGeneratedCode(data); // Change this line?
  
      setMessages(prev => [...prev, 
        { text: input, sender: 'user' },
        { text: 'App generated successfully! You can now make modifications.', sender: 'ai' }
      ]);
    } catch (error) {
      console.error('Error generating app:', error);
      setError(`Failed to connect to the server. Please ensure the backend is running on port 5001. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

// Not relevant yet. Key for iterations.
  const handleModification = useCallback(async (modificationText) => {
    setIsLoading(true);
    try {
      const updatedCode = await generateApp(`${appDescription}\n\nModification: ${modificationText}`);
      setGeneratedCode(updatedCode);
      setMessages(prev => [...prev,
        { text: modificationText, sender: 'user' },
        { text: 'App updated successfully!', sender: 'ai' }
      ]);
    } catch (error) {
      setError('Error applying modification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [appDescription]);

// Not relevant yet. Key for iterations.
  const handleSave = useCallback(() => {
    const id = saveApp(generatedCode, input, modifications);
    setAppId(id);
  }, [generatedCode, input, modifications]);

// Not relevant yet. Key for iterations.
  const handleShare = useCallback(() => {
    if (appId) {
      const link = getShareableLink(appId);
      navigator.clipboard.writeText(link)
        .then(() => alert('Shareable link copied to clipboard!'))
        .catch(() => alert(`Shareable link: ${link}`));
    }
  }, [appId]);

  return (
    <div className="chat-interface">
      <div className="server-status">Server Status: {serverStatus}</div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to make?"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate App'}
        </button>
      </form>
      {isLoading && <div className="loading">Generating your app...</div>}
      <AppPreview code={generatedCode} />
      {generatedCode && (
        <div className="modifications">
          <h3>Modifications</h3>
          <div className="modification-input">
            <input
              type="text"
              placeholder="Enter a modification..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleModification(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      )}
      {generatedCode && (
        <div className="save-share">
          <button onClick={handleSave}>Save App</button>
          <button onClick={handleShare} disabled={!appId}>
            Share App
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatInterface);