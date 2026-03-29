import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  resume: {
    type: String,
    default: '',
  },
  interviewStats: {
    totalInterviews: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    strongAreas: [{
      type: String,
    }],
    weakAreas: [{
      type: String,
    }],
  },
  avatar: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
