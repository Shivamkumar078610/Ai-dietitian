import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Profile from '../models/Profile.js';


const router = express.Router();

// GET profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Please setup your profile.' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST / update profile
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    const profileData = {
      userId: req.user.id,
      ...req.body
    };

    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      profile = await Profile.findOneAndUpdate({ userId: req.user.id }, profileData, { new: true });
    } else {
      profile = new Profile(profileData);
      await profile.save();
    }


    res.json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;

