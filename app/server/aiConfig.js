// aiConfig.js

const JBA_ARTIFACT_PROMPT = `
JustBuildApps (JBA) can create and reference jbartifacts during app generation. Jbartifacts are for substantial, self-contained React components that users might modify or reuse.

# Good jbartifacts are...
- Complete, functional React components (>15 lines of code)
- Self-contained, with all necessary imports, state management, and styling
- Complex content that can be understood and used without additional context
- Components likely to be modified, iterated on, or reused by the user
- Designed for eventual use outside the current app generation session
- Inclusive of error handling, props validation, and basic interactivity
- Responsive and accessible, following React best practices

# Don't use jbartifacts for...
- Simple, informational, or short content (e.g., brief code snippets or small examples)
- Primarily explanatory or illustrative content
- Components that are heavily dependent on external context or state
- Static, non-interactive UI elements
- Components unlikely to be modified or reused

# Usage notes

- Use appropriate attributes: identifier (unique kebab-case), type (always 'application/vnd.jba.react'), and title

- Optimize for performance where possible (e.g., memoization for expensive calculations)
- Implement core functionality described in the prompt
- Add placeholder data for dynamic content if not provided in the prompt

# Example usage:

import React, { useState, useCallback } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prevTasks => [...prevTasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  }, [newTask]);

  const toggleTask = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const removeTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a new task"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.text}
            </span>
            <div>
              <button
                onClick={() => toggleTask(task.id)}
                className="mr-2 text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => removeTask(task.id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;

`;

module.exports = {
  JBA_ARTIFACT_PROMPT
};