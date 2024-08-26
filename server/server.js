// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const { JBA_ARTIFACT_PROMPT } = require('./aiConfig');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

app.use(cors({
  origin: frontendURL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());

const validateJBArtifact = (code) => {
    const regex = /^<jbartifact[^>]*>[\s\S]*<\/jbartifact>$/;
    return regex.test(code.trim());
  };

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.post('/api/generate-app', async (req, res) => {
  const { prompt } = req.body;
  console.log('Received prompt:', prompt);

  res.writeHead(200, {
    'Content-Type': 'text/plain', // Change this to plain text
    'Connection': 'keep-alive'
  });

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in the environment');
    }

    let generatedCode = '';
    let isValidCode = false;
    let retries = 0;
    const maxRetries = 3;

    while (!isValidCode && retries < maxRetries) {
      const systemPrompt = JSON.parse(fs.readFileSync(path.join(__dirname, 'system-prompt.json'), 'utf8'));
      
      try {
        const stream = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 2000,
          temperature: 0.2,
          system: systemPrompt.systemPrompt,
          messages: [{
            role: "user",
            content: `Create a React app for: ${prompt}. 
            Ensure it's a single, self-contained component named 'App' that can be rendered immediately. 
            The component MUST be exported using one of these methods:
            1. 'export default function App() { ... }'
            2. 'const App = () => { ... }; export default App;'
            3. 'export function App() { ... }'
            Do not use any other export method. 
            Do not use 'export const App = ...' as it may not be correctly recognized.
            The entire component, including imports and exports, must be wrapped in <jbartifact> tags.
            No part of your response should be outside the <jbartifact> tags`
          }],
          stream: true,
        });

        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            generatedCode += chunk.delta.text;
          }
        }

        isValidCode = validateJBArtifact(generatedCode);
        if (!isValidCode) {
          console.log(`Generated code invalid, retrying (${retries + 1}/${maxRetries})`);
          retries++;
          generatedCode = ''; // Reset for next attempt
        }
      } catch (apiError) {
        console.error('API Error:', apiError.message);
        res.end(JSON.stringify({ error: apiError.message }));
        return;
      }
    }

    if (!isValidCode) {
      res.end('Failed to generate valid code after multiple attempts.');
    } else {
      res.end(generatedCode); // Send the generated code directly
    }

  } catch (error) {
    console.error('Error generating app code:', error);
    res.end('An error occurred while generating the app code.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`ANTHROPIC_API_KEY is ${process.env.ANTHROPIC_API_KEY ? 'set' : 'not set'}`);
});