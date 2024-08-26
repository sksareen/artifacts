import { generateAppCode } from './claudeService';

export const generateApp = async (description) => {
  try {
    const code = await generateAppCode(description);
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code received from the server');
    }
    return code.trim();
  } catch (error) {
    console.error('Error in generateApp:', error);
    throw error;
  }
};