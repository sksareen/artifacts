import React, { useState, useEffect, Suspense } from 'react';
import { transform } from '@babel/standalone';
import * as LucideIcons from 'lucide-react';

const DynamicComponent = ({ code }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        if (!code) return;
        
        const transformedCode = transform(code, {
          presets: ['react'],
          plugins: ['transform-modules-commonjs']
        }).code;

        const wrappedCode = `
          return function createComponent(React, LucideIconsProxy) {
            const require = (moduleName) => {
              if (moduleName === 'react') return React;
              if (moduleName === 'lucide-react') return LucideIconsProxy;
              throw new Error(\`Unable to require module: \${moduleName}\`);
            };
            let exports = {};
            const module = { exports };
            ${transformedCode}
            return module.exports.__esModule ? module.exports.default : module.exports;
          }
        `;

        const createComponent = new Function(wrappedCode)();

        // Create a proxy for LucideIcons
        const LucideIconsProxy = new Proxy({}, {
          get: function(target, prop) {
            if (prop in LucideIcons) {
              return LucideIcons[prop];
            }
            console.warn(`Icon "${prop}" not found in Lucide icons.`);
            // Return a placeholder component to prevent rendering errors
            return () => React.createElement('span', {}, `[Icon ${prop}]`);
          }
        });

        const Component = createComponent(React, LucideIconsProxy);
        setComponent(() => Component);
      } catch (error) {
        console.error('Error loading component:', error);
      }
    };

    loadComponent();
  }, [code]);

  if (!Component) {
    return <div>Loading component...</div>;
  }

  return (
    <Suspense fallback={<div>Rendering component...</div>}>
      <Component />
    </Suspense>
  );
};

const AppPreview = ({ code }) => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;

    try {
      // Basic validation
      if (!code.includes('function App') && !code.includes('const App') && !code.includes('class App')) {
        throw new Error('App component is not properly defined or exported');
      }
    } catch (error) {
      console.error('Error in AppPreview:', error);
      setError(`Error: ${error.message}`);
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-preview">
      <h2>App Preview</h2>
      <div className="preview-container">
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <DynamicComponent code={code} />
        )}
      </div>
      <h3>Generated Code</h3>
      <pre className="raw-code" onClick={handleCopy}>
        {code}
        {copied && <span className="copied">Copied!</span>}
      </pre>
    </div>
  );
};

export default AppPreview;