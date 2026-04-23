import express, { Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import InterviewResult from '../models/InterviewResult';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/email/progress', protect, async (req: any, res: Response) => {
  try {
    const user = req.user;
    const results = await InterviewResult.find({ userId: user._id }).sort({ date: -1 }).limit(10);

    if (results.length === 0) {
      return res.status(400).json({ message: 'No interview results found.' });
    }

    const avg = Math.round(results.reduce((s: number, r: any) => s + (r.score || 0), 0) / results.length);
    const highest = Math.max(...results.map((r: any) => r.score || 0));
    const latest = results[0]?.score ?? 0;
    const avgComm = Math.round(results.reduce((s: number, r: any) => s + (r.communicationScore || 0), 0) / results.length);
    const avgTech = Math.round(results.reduce((s: number, r: any) => s + (r.technicalScore || 0), 0) / results.length);
    const avgConf = Math.round(results.reduce((s: number, r: any) => s + (r.confidenceScore || 0), 0) / results.length);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#111;color:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#FF6A00,#cc3700);padding:2rem;text-align:center;">
          <h1 style="margin:0;font-size:1.8rem;">⚡ PanelQ Progress Report</h1>
          <p style="margin:0.5rem 0 0;opacity:0.9;">Hi ${user.name}, here's your interview progress!</p>
        </div>
        <div style="padding:2rem;">
          <h2 style="color:#FF6A00;margin-bottom:1rem;">📊 Performance Summary</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Total Interviews</td>
              <td style="padding:0.75rem;font-weight:700;">${results.length}</td>
            </tr>
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Average Score</td>
              <td style="padding:0.75rem;font-weight:700;color:#FF6A00;">${avg}%</td>
            </tr>
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Highest Score</td>
              <td style="padding:0.75rem;font-weight:700;color:#22c55e;">${highest}%</td>
            </tr>
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Latest Score</td>
              <td style="padding:0.75rem;font-weight:700;">${latest}%</td>
            </tr>
          </table>

          <h2 style="color:#FF6A00;margin:1.5rem 0 1rem;">🧠 Skill Scores</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Communication</td>
              <td style="padding:0.75rem;font-weight:700;">${avgComm}%</td>
            </tr>
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Technical</td>
              <td style="padding:0.75rem;font-weight:700;">${avgTech}%</td>
            </tr>
            <tr style="border-bottom:1px solid #333;">
              <td style="padding:0.75rem;color:#aaa;">Confidence</td>
              <td style="padding:0.75rem;font-weight:700;">${avgConf}%</td>
            </tr>
          </table>

          <h2 style="color:#FF6A00;margin:1.5rem 0 1rem;">📋 Recent Interviews</h2>
          ${results.slice(0, 5).map((r: any, i: number) => `
            <div style="background:#1a1a1a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;border-left:3px solid #FF6A00;">
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#aaa;">${new Date(r.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span style="color:#FF6A00;font-weight:700;">${r.score}%</span>
              </div>
            </div>
          `).join('')}

          <div style="text-align:center;margin-top:2rem;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
               style="background:linear-gradient(135deg,#FF6A00,#cc3700);color:white;padding:0.875rem 2rem;border-radius:0.75rem;text-decoration:none;font-weight:700;">
              View Full Profile
            </a>
          </div>
        </div>
        <div style="padding:1rem;text-align:center;color:#555;font-size:0.8rem;border-top:1px solid #222;">
          PanelQ — AI-Powered Interview Preparation
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"PanelQ" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `📊 Your PanelQ Progress Report — ${avg}% Average Score`,
      html,
    });

    res.json({ message: `Progress report sent to ${user.email}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
