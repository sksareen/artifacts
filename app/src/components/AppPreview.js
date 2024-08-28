import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { transform } from '@babel/standalone';
import { getDependency, extractImports } from '../utils/dynamicImports';

const AppPreview = ({ code, initialProps = {} }) => {
  const [renderedComponent, setRenderedComponent] = useState(null);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  const cleanCode = useMemo(() => (code) => {
    return code.trim();
  }, []);

  const transformCode = useMemo(() => (code) => {
    // Add React import if it's missing
    const reactImport = "import React from 'react';\n";
    const codeWithReactImport = code.includes('import React') ? code : reactImport + code;
  
    try {
      const transformedCode = transform(codeWithReactImport, {
        presets: ['react', 'env'],
        plugins: ['proposal-class-properties', 'proposal-object-rest-spread']
      }).code;
  
      return `
        ${transformedCode}
        (function() {
          if (typeof App !== 'undefined') {
            window.App = App;
          } else if (typeof exports !== 'undefined') {
            window.App = exports.default || exports.App || Object.values(exports)[0];
          }
          if (!window.App) {
            throw new Error('App component not found');
          }
          console.log('Transformed App:', window.App);
        })();
      `;
    } catch (error) {
      console.error('Babel transformation error:', error);
      setError(`Babel Error: ${error.message}`);
      throw error;
    }
  }, []);

  const validateAppComponent = (code) => {
    const appDefinitionRegex = /(?:export\s+(?:default\s+)?(?:function|class|const)\s+App|(?:const|let|var)\s+App\s*=|function\s+App)/;
    if (!appDefinitionRegex.test(code)) {
      throw new Error('App component is not properly defined or exported');
    }
  };

  const DynamicComponent = ({ code }) => {
    const [Component, setComponent] = useState(null);
  
    useEffect(() => {
      const loadComponent = async () => {
        try {
          if (!code) return;
          
          // Transform JSX to JavaScript
          const transformedCode = transform(code, {
            presets: ['react'],
            plugins: ['transform-modules-commonjs']
          }).code;
  
          // Wrap the transformed code in a function that provides necessary context
          const wrappedCode = `
          return function createComponent(React) {
            const require = (moduleName) => {
              if (moduleName === 'react') return React;
              throw new Error(\`Unable to require module: \${moduleName}\`);
            };
            let exports = {};
            const module = { exports };
            ${transformedCode}
            return module.exports.__esModule ? module.exports.default : module.exports;
          }
        `;
  
          // Create a function from the wrapped code
          const createComponent = new Function(wrappedCode)();
  
          // Execute the function with the React object
          const Component = createComponent(React);
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

  const compileAndRender = async () => {
    return <DynamicComponent code={code} />;
  }

  const compileAndRender2 = async () => {
    setError(null);
    if (!code) return;

    try {
      const cleanedCode = cleanCode(code);
      if (!cleanedCode) throw new Error('Invalid code format');

      validateAppComponent(cleanedCode);
      console.log('Validated code:');

      const imports = extractImports(cleanedCode);
      const dependencies = imports.reduce((acc, importName) => {
        
        const dep = getDependency(importName);
        if (dep) acc[importName] = dep;
        return acc;
      }, {});

      const transformedCode = transformCode(cleanedCode);
      console.log('Received code:', code);

      console.log('Cleaned code:', cleanedCode);
      console.log('Transformed code:', transformedCode);

      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '400px';
      iframe.style.border = 'none';

      const container = iframeRef.current;
      if (!container) {
        throw new Error('Container for iframe not found');
      }
      container.innerHTML = '';
      container.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            ${Object.entries(dependencies).map(([name, url]) => `<script src="${url}"></script>`).join('\n')}
          </head>
          <body>
            <div id="root"></div>
            <script>${transformedCode}</script>
            <script>
              const App = window.App.default || window.App;
              if (typeof App === 'function') {
                ReactDOM.render(React.createElement(App), document.getElementById('root'));
              } else {
                console.error('App is not a valid React component:', App);
                document.getElementById('root').innerHTML = 'Error: App component is not valid';
              }
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();

      await new Promise(resolve => {
        iframe.onload = resolve;
      });

      console.log('Component created and rendered successfully');
      setRenderedComponent(true);
    } catch (error) {
      console.error('Error in compileAndRender:', error);
      console.error('Error details:', error.stack);
      setError(`Error: ${error.message}\nStack: ${error.stack}`);
      setRenderedComponent(null);
    }
  };

  useEffect(() => {
    compileAndRender();
  }, [code, cleanCode, transformCode, initialProps]);

  return (
    <div className="app-preview">
      <h2>App Preview</h2>
      <div className="preview-container">
        {error && <div className="error">{error}</div>}
        <DynamicComponent code={code} />;
      </div>
      <h3>Generated Code</h3>
      <pre className="raw-code">{code}</pre>
    </div>
  );
};

export default AppPreview;