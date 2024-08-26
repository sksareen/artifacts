// What is axios??
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const generateAppCode = async (prompt) => {
  try {
    console.log('Sending request to API:', `${API_URL}/api/generate-app`);
    const response = await axios.post(`${API_URL}/api/generate-app`, { prompt }, {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'text' // Add this line to expect text response
    });
    console.log('Received response from API');
    return response.data; // Return the response data directly
  } catch (error) {
    console.error('Error in generateAppCode:', error);
    throw new Error(`Error generating app code: ${error.message}`);
  }
};


export const checkServerHealth = async () => {
  try {
    console.log('Checking server health at:', `${API_URL}/health`);
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    console.log('Health check response:', response.data);
    return response.data.status === 'OK';
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
};