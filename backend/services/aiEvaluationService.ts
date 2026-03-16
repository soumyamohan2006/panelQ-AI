import Groq from 'groq-sdk';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment variables');
  return new Groq({ apiKey });
};

export const generateQuestions = async (type: string): Promise<string[]> => {
  const groq = getGroqClient();

  const typeDescriptions: Record<string, string> = {
    technical: 'software engineering technical interview focusing on coding, algorithms, data structures, and system design',
    behavioral: 'behavioral interview using the STAR method focusing on real workplace situations and teamwork',
    hr: 'HR interview focusing on soft skills, career goals, cultural fit, and personal strengths',
  };

  const description = typeDescriptions[type] || typeDescriptions.hr;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{
      role: 'user',
      content: `Generate 6 unique and varied interview questions for a ${description}. Return a JSON object with a single key "questions" containing an array of 6 question strings. No markdown, no extra text.`
    }],
    response_format: { type: 'json_object' },
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('No response from Groq');

  const parsed = JSON.parse(text);
  return parsed.questions as string[];
};

interface EvaluationResult {
  score: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  feedback: string;
}

export const evaluateAnswers = async (answers: any[]): Promise<EvaluationResult> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in environment variables');

  const groq = getGroqClient();

  const prompt = `
You are an expert technical interviewer evaluating a candidate's responses.
Please review the following questions and the candidate's answers:

${JSON.stringify(answers, null, 2)}

Provide an evaluation in JSON format containing the following fields:
- "score": A number between 0 and 100 representing the overall quality of the answers.
- "communicationScore": A number between 0 and 100 evaluating the clarity and structure.
- "technicalScore": A number between 0 and 100 evaluating the technical correctness.
- "confidenceScore": A number between 0 and 100 evaluating the apparent confidence and decisiveness.
- "feedback": Constructive text feedback explaining the scores, highlighting strengths, and pointing out areas for improvement.

The response must be a single valid JSON object. Do not include markdown blocks like \`\`\`json.
  `.trim();

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const evaluationText = completion.choices[0]?.message?.content;

    if (!evaluationText) {
      throw new Error('No response received from Groq');
    }

    const parsedEvaluation = JSON.parse(evaluationText) as EvaluationResult;

    return {
      score: Number(parsedEvaluation.score) || 0,
      communicationScore: Number(parsedEvaluation.communicationScore) || 0,
      technicalScore: Number(parsedEvaluation.technicalScore) || 0,
      confidenceScore: Number(parsedEvaluation.confidenceScore) || 0,
      feedback: parsedEvaluation.feedback || 'No feedback provided.',
    };

  } catch (error) {
    console.error('Error evaluating answers with Groq:', error);
    throw new Error('Failed to evaluate answers using AI.');
  }
};
