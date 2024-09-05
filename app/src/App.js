/*
This code is a simple React application that includes an error boundary component to catch errors that occur in the rendering of components. Here's a breakdown of the code:

1. The `ErrorBoundary` component is a class component that extends `React.Component`. It initializes the state with a property `hasError` set to `false`.

2. The static method `getDerivedStateFromError` is a lifecycle method provided by React that is used to update state based on an error that is thrown in the child components. In this case, when an error is caught, `hasError` is set to `true`.

3. The `componentDidCatch` method is also a lifecycle method in React that catches an error thrown by any of the child components and logs the `error` and `errorInfo` to the console.

4. The `render` method checks if `hasError` is true. If it is, it returns a simple error message wrapped in an `<h1>` tag. Otherwise, it renders the child components passed to `ErrorBoundary`.

5. The `App` function component is the entry point of the application. It wraps the main content in the `ErrorBoundary` component to catch any errors that may occur during rendering.

6. Inside the `App` component, it renders a `div` with the class name "App" and includes the `ChatInterface` component, which presumably contains the main chat functionality of the application.

In terms of optimization, there are a couple of improvements that can be made:
- It's generally a good practice to avoid using template literals for rendering JSX. Instead of returning a string `<h1>Something went wrong. Please refresh the page.</h1>;`, return JSX directly like `<h1>Something went wrong. Please refresh the page.</h1>`.
- Ensure that error boundaries are used judiciously in the application and wrap only those components that are critical and may potentially throw errors.

Overall, this code demonstrates the use of an error boundary in a React application to gracefully handle errors that might occur during the rendering process.
*/

// src/App.js
import React from "react";
// import Layout from "./components/Layout";
import ChatInterface from "./components/ChatInterface";
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return `<h1>Something went wrong. Please refresh the page.</h1>;`;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
        <div className="App">
          <ChatInterface />
        </div>
    </ErrorBoundary>
  );
}

export default App;
