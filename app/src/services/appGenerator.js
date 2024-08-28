import { generateAppCode } from './claudeService';

export const generateApp = async (description) => {
  // try {
  //   const code = await generateAppCode(description);
  //   if (!code || typeof code !== 'string') {
  //     throw new Error('Invalid code received from the server');
  //   }
  //   return code.trim();
  // } catch (error) {
  //   console.error('Error in generateApp:', error);
  //   throw error;

      // Hardcoded response for testing
  const hardcodedResponse = `import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore((prevScore) => prevScore + 1);
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    const intervalId = setInterval(moveSnake, 150);
    return () => clearInterval(intervalId);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="mb-4">Score: {score}</div>
      <div
        className="relative bg-white border-2 border-gray-300"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      </div>
      {gameOver && (
        <div className="mt-4 text-xl font-bold text-red-500">Game Over!</div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        {gameOver ? 'Play Again' : 'Reset Game'}
      </button>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => setDirection({ x: 0, y: -1 })}
        >
          <ArrowUp />
        </button>
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => setDirection({ x: 0, y: 1 })}
        >
          <ArrowDown />
        </button>
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => setDirection({ x: -1, y: 0 })}
        >
          <ArrowLeft />
        </button>
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => setDirection({ x: 1, y: 0 })}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
  `;

  // Comment out the actual API call and return the hardcoded response
  // return generateAppCode(description);
  return hardcodedResponse.trim();
};