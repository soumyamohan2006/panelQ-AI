import { evaluateAnswers } from './services/aiEvaluationService';
import dotenv from 'dotenv';
import path from 'path';

// Fix for relative imports in tsx
dotenv.config({ path: './.env' });

const mockAnswers = [
  { question: "What is polymorphism?", answer: "Polymorphism is the ability of an object to take on many forms." }
];

async function debug() {
  console.log("Starting AI Debug...");
  console.log("GEMINI_API_KEY presence:", !!process.env.GEMINI_API_KEY);
  
  try {
    const result = await evaluateAnswers(mockAnswers);
    console.log("AI result successful:", JSON.stringify(result, null, 2));
  } catch (err: any) {
    console.error("AI Evaluation failed with error:", err.message);
    if (err.stack) console.error(err.stack);
  }
}

debug();
