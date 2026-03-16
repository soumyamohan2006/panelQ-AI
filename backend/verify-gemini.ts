import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: './backend/.env' });

async function verifyGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set');
    return;
  }

  console.log(`Using API Key: ${apiKey.substring(0, 10)}...`);

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  const prompt = 'Return a JSON object with a "status" field set to "ok".';

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('✅ Gemini Response:', response.text());
  } catch (error: any) {
    console.error('❌ Gemini Error:', error.message);
  }
}

verifyGemini();
