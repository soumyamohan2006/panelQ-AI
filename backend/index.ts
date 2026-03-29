import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import interviewRoutes from './routes/interviewRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

async function startServer() {
  await connectDB();

  const app = express();
  const PORT= Number(process.env.PORT) || 5000;

  app.use(cors());
  app.use(express.json());

  // Ensure uploads directory exists
  fs.mkdirSync('uploads/resumes', { recursive: true });

  app.use('/uploads', express.static('uploads'));

  // --- API Routes ---
  app.use('/api', authRoutes);
  app.use('/api', interviewRoutes);
  app.use('/api', profileRoutes);

  app.get('/', (req, res) => {
    res.send('PanelQ API is running. Direct frontend access is on port 5173.');
  });

  // --- Vite Middleware Removed ---
  // The frontend runs entirely independently on port 5173.

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Change PORT in .env and restart.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

startServer();
