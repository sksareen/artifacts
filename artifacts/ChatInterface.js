// src/components/ChatInterface.js

import React, { useState, useCallback, useEffect } from 'react';
import { generateApp } from '../services/appGenerator';
import { checkServerHealth } from '../services/claudeService';
import AppPreview from './AppPreview';
import { validateInput } from '../utils/validation';
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
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Generated code:', data.code);
      setGeneratedCode(data.code);
      
    } catch (error) {
      console.error('Error generating app:', error);
      setError(`Failed to generate app: ${error.message}`);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

//   const handleSubmitDUMMY = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);
//     setGeneratedCode('');
    
//     try {
//       console.log('Sending request to server...');
//       // Simulating a delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
  
//       // Dummy response
//       const dummyResponse = `import React, { useState, useEffect, useCallback } from 'react';
// import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

// const GRID_SIZE = 20;
// const CELL_SIZE = 20;
// const INITIAL_SNAKE = [{ x: 10, y: 10 }];
// const INITIAL_DIRECTION = { x: 1, y: 0 };
// const INITIAL_FOOD = { x: 15, y: 15 };

// export default function App() {
//   const [snake, setSnake] = useState(INITIAL_SNAKE);
//   const [direction, setDirection] = useState(INITIAL_DIRECTION);
//   const [food, setFood] = useState(INITIAL_FOOD);
//   const [gameOver, setGameOver] = useState(false);
//   const [score, setScore] = useState(0);

//   const moveSnake = useCallback(() => {
//     if (gameOver) return;

//     const newSnake = [...snake];
//     const head = { ...newSnake[0] };
//     head.x += direction.x;
//     head.y += direction.y;

//     if (
//       head.x < 0 ||
//       head.x >= GRID_SIZE ||
//       head.y < 0 ||
//       head.y >= GRID_SIZE ||
//       newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
//     ) {
//       setGameOver(true);
//       return;
//     }

//     newSnake.unshift(head);

//     if (head.x === food.x && head.y === food.y) {
//       setScore((prevScore) => prevScore + 1);
//       setFood({
//         x: Math.floor(Math.random() * GRID_SIZE),
//         y: Math.floor(Math.random() * GRID_SIZE),
//       });
//     } else {
//       newSnake.pop();
//     }

//     setSnake(newSnake);
//   }, [snake, direction, food, gameOver]);

//   useEffect(() => {
//     const intervalId = setInterval(moveSnake, 150);
//     return () => clearInterval(intervalId);
//   }, [moveSnake]);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       switch (e.key) {
//         case 'ArrowUp':
//           setDirection({ x: 0, y: -1 });
//           break;
//         case 'ArrowDown':
//           setDirection({ x: 0, y: 1 });
//           break;
//         case 'ArrowLeft':
//           setDirection({ x: -1, y: 0 });
//           break;
//         case 'ArrowRight':
//           setDirection({ x: 1, y: 0 });
//           break;
//         default:
//           break;
//       }
//     };

//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, []);

//   const resetGame = () => {
//     setSnake(INITIAL_SNAKE);
//     setDirection(INITIAL_DIRECTION);
//     setFood(INITIAL_FOOD);
//     setGameOver(false);
//     setScore(0);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
//       <div className="mb-4">Score: {score}</div>
//       <div
//         className="relative bg-white border-2 border-gray-300"
//         style={{
//           width: GRID_SIZE * CELL_SIZE,
//           height: GRID_SIZE * CELL_SIZE,
//         }}
//       >
//         {snake.map((segment, index) => (
//           <div
//             key={index}
//             className="absolute bg-green-500"
//             style={{
//               left: segment.x * CELL_SIZE,
//               top: segment.y * CELL_SIZE,
//               width: CELL_SIZE,
//               height: CELL_SIZE,
//             }}
//           />
//         ))}
//         <div
//           className="absolute bg-red-500"
//           style={{
//             left: food.x * CELL_SIZE,
//             top: food.y * CELL_SIZE,
//             width: CELL_SIZE,
//             height: CELL_SIZE,
//           }}
//         />
//       </div>
//       {gameOver && (
//         <div className="mt-4 text-xl font-bold text-red-500">Game Over!</div>
//       )}
//       <button
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         onClick={resetGame}
//       >
//         {gameOver ? 'Play Again' : 'Reset Game'}
//       </button>
//       <div className="mt-4 grid grid-cols-3 gap-2">
//         <button
//           className="p-2 bg-gray-200 rounded"
//           onClick={() => setDirection({ x: 0, y: -1 })}
//         >
//           <ArrowUp />
//         </button>
//         <button
//           className="p-2 bg-gray-200 rounded"
//           onClick={() => setDirection({ x: 0, y: 1 })}
//         >
//           <ArrowDown />
//         </button>
//         <button
//           className="p-2 bg-gray-200 rounded"
//           onClick={() => setDirection({ x: -1, y: 0 })}
//         >
//           <ArrowLeft />
//         </button>
//         <button
//           className="p-2 bg-gray-200 rounded"
//           onClick={() => setDirection({ x: 1, y: 0 })}
//         >
//           <ArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// }
//   `;
  
//       console.log('Data received, code length:', dummyResponse.length);
//       setGeneratedCode(dummyResponse);
  
//       setMessages(prev => [...prev, 
//         { text: input, sender: 'user' },
//         { text: 'App generated successfully! You can now make modifications.', sender: 'ai' }
//       ]);
//     } catch (error) {
//       console.error('Error generating app:', error);
//       setError(`Failed to connect to the server. Please ensure the backend is running on port 5001. Error: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//       setInput('');
//     }
//   };

// Not relevant yet. Key for iterations.
  
  const handleModification = useCallback(async (modificationText) => {
    setIsLoading(true);
    try {
      const updatedCode = await generateApp(`${appDescription}\n\nModification: ${modificationText}`);
      console.log('Updated code:', updatedCode);
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
    <>
    <div className="jba-app-wrapper chat-interface">
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
      <AppPreview code={generatedCode} />
      </>
  );
};

export default React.memo(ChatInterface);