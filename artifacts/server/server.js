const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');

const app = express();
const PORT = 3005;
const COMPONENTS_DIR = path.join(__dirname, 'components');

console.log('COMPONENTS_DIR:', COMPONENTS_DIR);

// Serve static files from the current directory and its subdirectories
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index', 'index.html'));
});

app.get('/:componentName', async (req, res) => {
  const { componentName } = req.params;

  if (componentName === 'favicon.ico') return res.status(204).end();

  const sanitizedComponentName = componentName.replace(/[^a-zA-Z0-9@]/g, '');
  
  try {
    const componentFile = `${sanitizedComponentName}.jsx`;
    const componentPath = path.join(COMPONENTS_DIR, componentFile);

    if (!await fs.access(componentPath).then(() => true).catch(() => false)) {
      return res.status(404).send(`Component not found: ${sanitizedComponentName}`);
    }

    const componentCode = await fs.readFile(componentPath, 'utf-8');
    const templateHtml = await fs.readFile(path.join(__dirname, 'index', 'index.html'), 'utf-8');
    const atComponentCss = await fs.readFile(path.join(__dirname, 'index', 'index.css'), 'utf-8');

    // Remove import statements as they'll be handled by Babel
    const processedCode = componentCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');

    const { code: transformedCode } = await babel.transformAsync(processedCode, {
      presets: ['@babel/preset-react'],
      plugins: [
        ['@babel/plugin-transform-modules-umd', {
          exactGlobals: true,
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-modules-commonjs'
      ]
    });

    const browserSafeCode = transformedCode
      .replace(/_react\.default/g, 'React')
      .replace(/\(this\)\);\s*\}\)\(this\)\);$/m, '(window));});')
      .replace(/exports\.default = (\w+);/, 'window.$1 = $1;')
      // .replace(/require\([^)]+\)/g, '{}');

    const script = `
      ${browserSafeCode}
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded event fired');
        const rootElement = document.getElementById('root');
        console.log('Available global objects:', Object.keys(window));
        const ComponentToRender = window['${sanitizedComponentName}'];
        console.log('ComponentToRender:', ComponentToRender);
        if (ComponentToRender) {
          const root = ReactDOM.createRoot(rootElement);
          root.render(React.createElement(ComponentToRender));
        } else {
          console.error('Component not found in global scope');
          rootElement.innerHTML = 'Component not found';
        }
      });
    `;

    const renderedHtml = templateHtml
      .replace('{{componentName}}', sanitizedComponentName)
      .replace('{{script}}', script)
      .replace('{{atComponentCss}}', `<style>${atComponentCss}</style>`);

    res.send(renderedHtml);

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).send(`Error: ${error.message}\nStack: ${error.stack}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});