import { evaluateAnswers } from './backend/services/aiEvaluationService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleAnswers = [
  {
    questionId: 't1',
    questionText: 'What is polymorphism and how is it implemented in your favorite language?',
    answerText: 'Polymorphism allows objects of different classes to be treated as objects of a common superclass. In JavaScript, it is often implemented via prototype-based inheritance or using classes where derived classes override methods of base classes.'
  },
  {
    questionId: 'b1',
    questionText: 'Tell me about a time you faced a significant challenge at work and how you overcame it.',
    answerText: 'I once had a very tight deadline for a product launch and the main API we relied on changed its structure. I quickly reorganized the team to allocate more resources to adapting the data layer, communicated the delay clearly to stakeholders, and we ended up shipping only 2 days late but with a much more robust error-handling system.'
  }
];

async function testEvaluation() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('❌ Please add a valid GEMINI_API_KEY to your .env file before testing.');
    process.exit(1);
  }

  console.log('Testing AI Evaluation with Sample Answers...');
  try {
    const result = await evaluateAnswers(sampleAnswers);
    console.log('\n✅ Evaluation Successful!');
    console.log('--- AI Evaluation Result ---');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ AI Evaluation Failed:', err);
  }
}

testEvaluation();
