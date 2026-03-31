import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], default: 'Full-time' },
  skills:      { type: String },
  description: { type: String },
  applyLink:   { type: String },
  postedAt:    { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
