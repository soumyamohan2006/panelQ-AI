import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, phone, location, role, skills, avatar, gender, resume } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.location = location || user.location;
    user.role = role || user.role;
    user.skills = skills || user.skills;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.gender = gender || user.gender;
    user.resume = resume !== undefined ? resume : user.resume;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      role: updatedUser.role,
      skills: updatedUser.skills,
      avatar: updatedUser.avatar,
      gender: updatedUser.gender,
      resume: updatedUser.resume,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required' });
  }

  const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = resumeUrl;
    await user.save();

    res.json({ resume: resumeUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};