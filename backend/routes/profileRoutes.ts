import express from 'express';
import multer from 'multer';
import path from 'path';
import { getProfile, updateProfile, changePassword, uploadResume } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/user/profile', protect, getProfile);
router.put('/user/update', protect, updateProfile);
router.put('/user/change-password', protect, changePassword);
router.post('/user/upload-resume', protect, upload.single('resume'), uploadResume);

export default router;