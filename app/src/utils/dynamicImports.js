import React from 'react';

const availableDependencies = {
  'react': React,
};

// Dynamically try to import additional dependencies
try {
  const ReactRouterDOM = require('react-router-dom');
  availableDependencies['react-router-dom'] = ReactRouterDOM;
} catch (error) {
  console.warn("react-router-dom is not available:", error.message);
}

try {
  const axios = require('axios');
  availableDependencies['axios'] = axios;
} catch (error) {
  console.warn("axios is not available:", error.message);
}

export const getDependency = (name) => {
  console.log('Getting dependency:', name);
  const dependency = availableDependencies[name];
  console.log('Dependency found:', dependency ? 'Yes' : 'No');
  return dependency || null;
};

export const extractImports = (code) => {
  console.log('Extracting imports from code:', code.substring(0, 100) + '...');
  
  // Remove the XML-like wrapper if present
  const cleanedCode = code.replace(/<jbartifact[^>]*>([\s\S]*)<\/jbartifact>/, '$1').trim();
  console.log('Cleaned code:', cleanedCode.substring(0, 100) + '...');
  
  const importRegex = /import\s+(?:(?:\*\s+as\s+)?\w+|\{\s*[\w\s,]+\})\s+from\s+['"]([^'"]+)['"]/g;
  console.log('Import regex:', importRegex);
  const imports = [];
  let match;
  
  try {
    while ((match = importRegex.exec(cleanedCode)) !== null) {
      console.log('Found import:', match[0]);
      imports.push(match[1]);
    }
  } catch (error) {
    console.error('Error during import extraction:', error);
  }
  
  console.log('Extracted imports:', imports);
  return imports;
};