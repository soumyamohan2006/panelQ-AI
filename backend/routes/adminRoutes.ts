import express, { Request, Response } from 'express';
import User from '../models/User';
import InterviewResult from '../models/InterviewResult';
import Job from '../models/Job';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// ── Dashboard Stats ──
router.get('/admin/stats', protect, adminOnly, async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalInterviews, totalJobs, results] = await Promise.all([
      User.countDocuments(),
      InterviewResult.countDocuments(),
      Job.countDocuments(),
      InterviewResult.find({}, 'score date'),
    ]);
    const avgScore = results.length
      ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length)
      : 0;

    // User growth: last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const userGrowth = await Promise.all(days.map(async day => {
      const start = new Date(day); const end = new Date(day); end.setDate(end.getDate() + 1);
      const count = await User.countDocuments({ createdAt: { $gte: start, $lt: end } });
      return { day: day.slice(5), count };
    }));

    // Interview trend: last 7 days avg score
    const interviewTrend = await Promise.all(days.map(async day => {
      const start = new Date(day); const end = new Date(day); end.setDate(end.getDate() + 1);
      const recs = await InterviewResult.find({ date: { $gte: start, $lt: end } }, 'score');
      const avg = recs.length ? Math.round(recs.reduce((s, r) => s + (r.score || 0), 0) / recs.length) : 0;
      return { day: day.slice(5), avg };
    }));

    res.json({ totalUsers, totalInterviews, totalJobs, avgScore, userGrowth, interviewTrend });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

// ── User Management ──
router.get('/admin/users', protect, adminOnly, async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    const withCount = await Promise.all(users.map(async u => ({
      _id: u._id, name: u.name, email: u.email,
      createdAt: u.createdAt,
      status: (u as any).blocked ? 'Blocked' : 'Active',
      interviewCount: await InterviewResult.countDocuments({ userId: u._id }),
    })));
    res.json(withCount);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete('/admin/users/:id', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await InterviewResult.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.patch('/admin/users/:id/block', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id) as any;
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.blocked = !user.blocked;
    await user.save();
    res.json({ blocked: user.blocked });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

// ── Interview Monitoring ──
router.get('/admin/interviews', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const { category, minScore, maxScore, date } = req.query;
    let query: any = {};
    if (minScore) query.score = { ...query.score, $gte: Number(minScore) };
    if (maxScore) query.score = { ...query.score, $lte: Number(maxScore) };
    if (date) { const d = new Date(date as string); const e = new Date(d); e.setDate(e.getDate() + 1); query.date = { $gte: d, $lt: e }; }

    const results = await InterviewResult.find(query).populate('userId', 'name email').sort({ date: -1 }).limit(100);
    res.json(results);
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

// ── Job Management ──
router.get('/admin/jobs', protect, adminOnly, async (_req: Request, res: Response) => {
  try { res.json(await Job.find().sort({ postedAt: -1 })); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.post('/admin/jobs', protect, adminOnly, async (req: Request, res: Response) => {
  try { res.status(201).json(await Job.create(req.body)); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.put('/admin/jobs/:id', protect, adminOnly, async (req: Request, res: Response) => {
  try { res.json(await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.delete('/admin/jobs/:id', protect, adminOnly, async (req: Request, res: Response) => {
  try { await Job.findByIdAndDelete(req.params.id); res.json({ message: 'Job deleted' }); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

// ── Analytics ──
router.get('/admin/analytics', protect, adminOnly, async (_req: Request, res: Response) => {
  try {
    const results = await InterviewResult.find({}, 'score communicationScore technicalScore confidenceScore date');

    // Score distribution buckets
    const buckets = [
      { label: '0-20', count: 0 }, { label: '21-40', count: 0 },
      { label: '41-60', count: 0 }, { label: '61-80', count: 0 }, { label: '81-100', count: 0 },
    ];
    results.forEach(r => {
      const s = r.score || 0;
      if (s <= 20) buckets[0].count++;
      else if (s <= 40) buckets[1].count++;
      else if (s <= 60) buckets[2].count++;
      else if (s <= 80) buckets[3].count++;
      else buckets[4].count++;
    });

    // Avg skill scores
    const avgComm = results.length ? Math.round(results.reduce((s, r) => s + (r.communicationScore || 0), 0) / results.length) : 0;
    const avgTech = results.length ? Math.round(results.reduce((s, r) => s + (r.technicalScore || 0), 0) / results.length) : 0;
    const avgConf = results.length ? Math.round(results.reduce((s, r) => s + (r.confidenceScore || 0), 0) / results.length) : 0;

    res.json({ scoreDistribution: buckets, avgComm, avgTech, avgConf });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

export default router;
