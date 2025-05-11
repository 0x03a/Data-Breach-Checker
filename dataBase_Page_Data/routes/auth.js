const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Hardcoded admin credentials
const ADMIN_NAME = 'Inshal';
const ADMIN_EMAIL = 'f223365@cfd.nu.edu.pk';
const ADMIN_PASSWORD = '@123insh';

// Generate a random session token
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware to authenticate using token from Authorization header
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  // Check for hardcoded admin
  if (token === 'admin-static-token') {
    req.user = { id: 'admin', isAdmin: true, fullname: ADMIN_NAME, email: ADMIN_EMAIL };
    return next();
  }

  // Check in DB for user with this token
  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = user;
  next();
}

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Check for hardcoded admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Return a static token for admin
    return res.json({ success: true, isAdmin: true, fullname: ADMIN_NAME, token: 'admin-static-token' });
  }
  // Otherwise, check database for regular users
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  // Generate new session token
  const sessionToken = generateSessionToken();
  user.sessionToken = sessionToken;
  await user.save();

  res.json({ success: true, isAdmin: user.isAdmin, fullname: user.fullname, token: sessionToken });
});

// Logout (invalidate token)
router.post('/logout', authenticateToken, async (req, res) => {
  if (req.user.id !== 'admin') {
    req.user.sessionToken = null;
    await req.user.save();
  }
  res.json({ success: true });
});

// Check session
router.get('/session', authenticateToken, async (req, res) => {
  if (req.user) {
    // For admin, just return the session
    if (req.user.id === 'admin') {
      return res.json({ loggedIn: true, user: req.user });
    }
    // For regular users
    res.json({ loggedIn: true, user: {
      id: req.user._id,
      isAdmin: req.user.isAdmin,
      fullname: req.user.fullname,
      email: req.user.email
    }});
  } else {
    res.json({ loggedIn: false });
  }
});

// Update user profile (token required, not admin)
router.post('/update-profile', authenticateToken, async (req, res) => {
  if (!req.user || req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user._id;
  const { fullname, email, password } = req.body;
  if (!fullname && !email && !password) {
    return res.status(400).json({ error: 'Input fields are empty.' });
  }
  // Validation
  if (email === ADMIN_EMAIL) {
    return res.status(400).json({ error: 'Cannot use admin email.' });
  }
  const update = {};
  if (fullname) update.fullname = fullname;
  if (email) {
    // Check unique email
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    update.email = email;
  }
  if (password) {
    // Check unique password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingPassword = await User.findOne({ password: hashedPassword, _id: { $ne: userId } });
    if (existingPassword) {
      return res.status(400).json({ error: 'Password already exists.' });
    }
    update.password = hashedPassword;
  }
  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  res.json({ success: true, user });
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      fullname,
      email,
      password: hashedPassword,
      isAdmin: false
    });

    // Save user to database
    await user.save();

    // Add password to breach database
    const Password = require('../models/Password');
    await Password.create({ password });

    // Generate session token
    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    await user.save();

    // Return success with token
    res.status(201).json({
      success: true,
      token: sessionToken,
      user: {
        fullname: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 