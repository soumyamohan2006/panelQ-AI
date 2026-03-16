import mongoose from 'mongoose';

const interviewResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      questionId: String,
      questionText: String,
      answerText: String,
    },
  ],
  score: Number,
  communicationScore: Number,
  technicalScore: Number,
  confidenceScore: Number,
  feedback: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);
export default InterviewResult;
