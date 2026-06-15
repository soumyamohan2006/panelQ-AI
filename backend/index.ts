import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import interviewRoutes from './routes/interviewRoutes';
import adminRoutes from './routes/adminRoutes';
import emailRoutes from './routes/emailRoutes';

dotenv.config();

async function startServer() {
  await connectDB();

  const app = express();
  const PORT = Number(process.env.PORT) || 5000;
  const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    console.error('❌ Missing required env var: FRONTEND_URL');
    process.exit(1);
  }

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));
  app.use(express.json());

  // --- API Routes ---
  app.use('/api', authRoutes);
  app.use('/api', interviewRoutes);
  app.use('/api', adminRoutes);
  app.use('/api', emailRoutes);

  app.get('/', (_req, res) => {
    res.send('PanelQ API is running. Frontend is served separately.');
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
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
