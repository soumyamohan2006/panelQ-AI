import { Request, Response } from 'express';
import InterviewResult from '../models/InterviewResult';
import User from '../models/User';
import { evaluateAnswers, generateQuestions, chatReply } from '../services/aiEvaluationService';

export const chat = async (req: Request, res: Response) => {
  const { systemPrompt, messages } = req.body;
  try {
    const reply = await chatReply(systemPrompt, messages);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  const { type } = req.query;
  try {
    const questions = await generateQuestions((type as string) || 'hr');
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// AI evaluation logic has been moved to services/aiEvaluationService.ts

export const submitInterview = async (req: any, res: Response) => {
  const { answers, score, feedback, communicationScore, technicalScore, confidenceScore } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    let finalScore = score;
    let finalFeedback = feedback;
    let finalComm = communicationScore;
    let finalTech = technicalScore;
    let finalConf = confidenceScore;

    if (score === undefined || score === null) {
      // Scores not provided by frontend, evaluate using AI
      const aiResult = await evaluateAnswers(answers);
      finalScore = aiResult.score;
      finalFeedback = aiResult.feedback;
      finalComm = aiResult.communicationScore;
      finalTech = aiResult.technicalScore;
      finalConf = aiResult.confidenceScore;
    }

    // Map answers to schema format if they are simple objects from frontend
    // Frontend sends: { question: string, answer: string }
    // Schema expects: { questionId: string, questionText: string, answerText: string }
    const formattedAnswers = answers.map((ans: any, index: number) => ({
      questionId: ans.questionId || `q-${index}`,
      questionText: ans.question || ans.questionText || '',
      answerText: ans.answer || ans.answerText || '',
    }));

    const result = await InterviewResult.create({
      userId,
      answers: formattedAnswers,
      score: finalScore,
      feedback: finalFeedback,
      communicationScore: finalComm,
      technicalScore: finalTech,
      confidenceScore: finalConf,
    });

    // Update user's interview stats
    const user = await User.findById(userId);
    if (user) {
      const currentStats = user.interviewStats;
      const newTotal = currentStats.totalInterviews + 1;
      const newAverage = ((currentStats.averageScore * currentStats.totalInterviews) + finalScore) / newTotal;

      // Determine strong and weak areas based on scores
      const strongAreas = [];
      const weakAreas = [];

      if (finalComm >= 70) strongAreas.push('Communication');
      else if (finalComm < 50) weakAreas.push('Communication');

      if (finalTech >= 70) strongAreas.push('Technical Skills');
      else if (finalTech < 50) weakAreas.push('Technical Skills');

      if (finalConf >= 70) strongAreas.push('Confidence');
      else if (finalConf < 50) weakAreas.push('Confidence');

      user.interviewStats = {
        totalInterviews: newTotal,
        averageScore: Math.round(newAverage * 100) / 100, // Round to 2 decimal places
        strongAreas: [...new Set([...currentStats.strongAreas, ...strongAreas])], // Remove duplicates
        weakAreas: [...new Set([...currentStats.weakAreas, ...weakAreas])], // Remove duplicates
      };

      await user.save();
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDemoInterview = (_req: Request, res: Response) => {
  res.json({
    demo: true,
    answers: [
      { questionText: 'Tell me about yourself.', answerText: 'I am a full-stack developer with 3 years of experience building scalable web applications using React and Node.js.' },
      { questionText: 'What is your greatest strength?', answerText: 'My ability to break down complex problems into manageable tasks and deliver clean, maintainable code.' },
      { questionText: 'Describe a challenging project you worked on.', answerText: 'I led a migration from a monolithic architecture to microservices, reducing deployment time by 40%.' },
      { questionText: 'How do you handle tight deadlines?', answerText: 'I prioritize tasks using a kanban board, communicate blockers early, and focus on delivering the highest-value features first.' },
      { questionText: 'Where do you see yourself in 5 years?', answerText: 'I aim to grow into a senior engineering role, mentoring junior developers and contributing to architectural decisions.' },
      { questionText: 'Why do you want to join our company?', answerText: 'Your focus on developer experience and open-source contributions aligns perfectly with my values and career goals.' },
    ],
    score: 82,
    communicationScore: 85,
    technicalScore: 78,
    confidenceScore: 84,
    feedback: 'Strong communication and clear structure throughout. Technical depth could be improved with more specific examples. Overall a confident and well-rounded performance.',
    date: new Date().toISOString(),
  });
};

export const getResults = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const results = await InterviewResult.find({ userId }).sort({ date: -1 });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
