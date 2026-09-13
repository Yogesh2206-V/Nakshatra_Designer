import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { db } from '../db/database.js';

const router = express.Router();

const ADMIN_PHONE = '9123500065';
const ADMIN_NAME = 'Nakshatradesign';
const ADMIN_HASH = '$2b$10$nVGdomzd.BuPN39OgqzpdeUYRuK.68fngtbkydisW4VI2BaEUpdMO'; // Hash for Nakshatradesigner@123

// Helper to normalize phone numbers (strip spaces, dashes, +91)
function normalizePhone(input) {
  if (!input) return '';
  const cleaned = input.toString().replace(/[\s+-]/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned.substring(2);
  }
  return cleaned;
}

// Helper to check if a user is the designated admin
function checkIsAdmin(phone, name = '') {
  const norm = normalizePhone(phone);
  if (norm === ADMIN_PHONE) return true;
  if (name && name.trim().toLowerCase() === ADMIN_NAME.toLowerCase() && norm === ADMIN_PHONE) return true;
  return false;
}

// Auto-seed or update default admin user in store
function ensureAdminSeeded() {
  if (!db.data.users) db.data.users = [];
  const existingAdminIndex = db.data.users.findIndex(u => normalizePhone(u.phone) === ADMIN_PHONE);
  if (existingAdminIndex === -1) {
    db.data.users.push({
      id: 'admin_nakshatra_01',
      name: ADMIN_NAME,
      phone: ADMIN_PHONE,
      email: 'nakshatradesign@gmail.com',
      password: ADMIN_HASH,
      role: 'admin',
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
    db.save();
  } else {
    db.data.users[existingAdminIndex].isAdmin = true;
    db.data.users[existingAdminIndex].role = 'admin';
    db.data.users[existingAdminIndex].name = ADMIN_NAME;
    db.data.users[existingAdminIndex].password = ADMIN_HASH;
    db.save();
  }
}
ensureAdminSeeded();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, phoneOrEmail, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!phoneOrEmail || !phoneOrEmail.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile number or email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(phoneOrEmail);
    const normalizedPhone = isEmail ? '' : normalizePhone(phoneOrEmail);
    const email = isEmail ? phoneOrEmail.trim().toLowerCase() : '';
    const isAdmin = checkIsAdmin(normalizedPhone || phoneOrEmail, name);

    // Check if user already exists in MongoDB
    let existingUser = null;
    try {
      if (normalizedPhone) {
        existingUser = await User.findOne({ phone: normalizedPhone });
      } else if (email) {
        existingUser = await User.findOne({ email });
      }
    } catch (err) {
      console.warn('MongoDB search fallback to local store:', err.message);
    }

    // Also check local store if mongo didn't find or errored
    if (!existingUser && db.data.users) {
      existingUser = db.data.users.find(u => 
        (normalizedPhone && u.phone === normalizedPhone) || 
        (email && u.email === email)
      );
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this mobile number/email is already registered. Please Log In.'
      });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let savedUser = null;
    try {
      const newUser = new User({
        name: name.trim(),
        phone: normalizedPhone || phoneOrEmail.trim(),
        email: email,
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'user',
        isAdmin: isAdmin
      });
      savedUser = await newUser.save();
    } catch (dbErr) {
      console.warn('MongoDB save warning:', dbErr.message);
    }

    // Also sync to db store
    if (!db.data.users) db.data.users = [];
    const localUserObj = {
      id: savedUser?._id?.toString() || 'usr_' + Date.now(),
      name: name.trim(),
      phone: normalizedPhone || phoneOrEmail.trim(),
      email: email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user',
      isAdmin: isAdmin,
      createdAt: new Date().toISOString()
    };
    db.data.users.push(localUserObj);
    db.save();

    return res.status(201).json({
      success: true,
      message: isAdmin ? 'Welcome Admin Nakshatradesign! Admin access granted.' : 'Account created successfully! You are now logged in.',
      user: {
        id: localUserObj.id,
        name: localUserObj.name,
        phone: localUserObj.phone,
        email: localUserObj.email,
        role: localUserObj.role,
        isAdmin: localUserObj.isAdmin
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during sign up. Please try again.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;

    if (!phoneOrEmail || !phoneOrEmail.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your registered mobile number or email.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please enter your password.' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(phoneOrEmail);
    const normalizedPhone = isEmail ? '' : normalizePhone(phoneOrEmail);
    const email = isEmail ? phoneOrEmail.trim().toLowerCase() : '';

    // Search user in MongoDB
    let user = null;
    try {
      if (normalizedPhone) {
        user = await User.findOne({
          $or: [
            { phone: normalizedPhone },
            { phone: phoneOrEmail.trim() }
          ]
        });
      } else if (email) {
        user = await User.findOne({ email });
      }
    } catch (err) {
      console.warn('MongoDB login lookup fallback:', err.message);
    }

    // Fallback search in store
    if (!user && db.data.users) {
      user = db.data.users.find(u => 
        (normalizedPhone && (u.phone === normalizedPhone || u.phone === phoneOrEmail.trim())) || 
        (email && u.email === email)
      );
    }

    // IF USER IS NOT FOUND:
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user. This mobile number or email is not registered. Please sign up first.'
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const isAttemptingAdmin = checkIsAdmin(user.phone, user.name);
      return res.status(401).json({
        success: false,
        message: isAttemptingAdmin 
          ? 'Invalid password for Administrator Nakshatradesign. Please re-enter the correct admin password.' 
          : 'Invalid credentials. Incorrect password entered. Please try again.'
      });
    }

    const isAdmin = checkIsAdmin(user.phone, user.name);

    return res.json({
      success: true,
      message: isAdmin ? 'Welcome back Admin Nakshatradesign!' : 'Login successful! Welcome back.',
      user: {
        id: user._id?.toString() || user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar || '',
        role: isAdmin ? 'admin' : 'user',
        isAdmin: isAdmin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
});

// PUT /api/auth/avatar - Update client profile photo
router.put('/avatar', async (req, res) => {
  try {
    const { userId, phone, email, avatar } = req.body;

    if (!userId && !phone && !email) {
      return res.status(400).json({ success: false, message: 'User ID, Phone, or Email is required.' });
    }

    const cleanPhone = phone ? phone.replace(/[\s+-]/g, '') : '';

    // Update in MongoDB
    let updatedUser = null;
    try {
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        updatedUser = await User.findByIdAndUpdate(userId, { avatar: avatar || '' }, { new: true });
      }
      if (!updatedUser && phone) {
        updatedUser = await User.findOneAndUpdate(
          { $or: [{ phone: phone }, { phone: cleanPhone }] },
          { avatar: avatar || '' },
          { new: true }
        );
      }
      if (!updatedUser && email) {
        updatedUser = await User.findOneAndUpdate(
          { email: email.trim().toLowerCase() },
          { avatar: avatar || '' },
          { new: true }
        );
      }
    } catch (e) {
      console.warn('Mongo avatar update warning:', e.message);
    }

    // Update in local store as well
    if (db.data.users) {
      const uIndex = db.data.users.findIndex(u => 
        (userId && u.id === userId) || 
        (phone && (u.phone === phone || u.phone === cleanPhone || (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanPhone))) ||
        (email && u.email && u.email.toLowerCase() === email.trim().toLowerCase())
      );
      if (uIndex !== -1) {
        db.data.users[uIndex].avatar = avatar || '';
        db.save();
      }
    }

    return res.json({
      success: true,
      message: avatar ? 'Profile photo updated successfully!' : 'Profile photo removed.',
      avatar: avatar || ''
    });
  } catch (err) {
    console.error('Error updating avatar:', err);
    return res.status(500).json({ success: false, message: 'Failed to update avatar.' });
  }
});

// GET /api/auth/users (for diagnostics/verification)
router.get('/users', async (req, res) => {
  try {
    let users = [];
    try {
      users = await User.find({}, '-password');
    } catch (e) {
      users = (db.data.users || []).map(({ password, ...rest }) => rest);
    }
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
