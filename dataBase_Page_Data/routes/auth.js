const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Password = require('../models/Password');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');

// Generate a random session token
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware to authenticate using token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  // Hardcoded admin
  if (token === 'admin-static-token') {
    req.user = { id: 'admin', isAdmin: true, fullname: 'Inshal', email: 'inshal@gmail.com' };
    return next();
  }

  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = user;
  next();
}

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === 'inshal@gmail.com' && password === '@123insR') {
    return res.json({ success: true, isAdmin: true, fullname: 'Inshal', token: 'admin-static-token' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const sessionToken = generateSessionToken();
  user.sessionToken = sessionToken;
  await user.save();

  res.json({ success: true, isAdmin: user.isAdmin, fullname: user.fullname, token: sessionToken });
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullname, email, password: hashedPassword, isAdmin: false });
    await user.save();

    await Password.create({ password });

    const sessionToken = generateSessionToken();
    user.sessionToken = sessionToken;
    await user.save();

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

// Logout
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
    if (req.user.id === 'admin') {
      return res.json({ loggedIn: true, user: req.user });
    }
    res.json({
      loggedIn: true,
      user: {
        id: req.user._id,
        isAdmin: req.user.isAdmin,
        fullname: req.user.fullname,
        email: req.user.email
      }
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// Update profile
router.post('/update-profile', authenticateToken, async (req, res) => {
  if (!req.user || req.user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user._id;
  const { fullname, email, password } = req.body;

  if (!fullname && !email && !password) {
    return res.status(400).json({ error: 'Input fields are empty.' });
  }

  const update = {};
  if (fullname) update.fullname = fullname;
  if (email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) return res.status(400).json({ error: 'Email already exists.' });
    update.email = email;
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingPassword = await User.findOne({ password: hashedPassword, _id: { $ne: userId } });
    if (existingPassword) return res.status(400).json({ error: 'Password already exists.' });
    update.password = hashedPassword;
  }

  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  res.json({ success: true, user });
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

// Google Signup Route
router.get('/google/signup', passport.authenticate('google-signup', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

// Google Signup Callback
router.get('/google/signup/callback',
  passport.authenticate('google-signup', { 
    failureRedirect: '/views/home.html?error=signup_failed',
    failureMessage: true
  }),
  async (req, res) => {
    try {
      if (!req.user) throw new Error('No user authenticated');
      
      const sessionToken = generateSessionToken();
      req.user.sessionToken = sessionToken;
      await req.user.save();

      res.redirect(`http://localhost:3000/?token=${sessionToken}`);
    } catch (error) {
      console.error('Google Signup Callback Error:', error);
      res.redirect('/views/home.html?error=signup_failed&message=' + encodeURIComponent(error.message));
    }
  }
);

// Google Login Callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/views/home.html?error=login_failed',
    failureMessage: true
  }),
  async (req, res) => {
    try {
      if (!req.user) throw new Error('No user authenticated');
      
      const sessionToken = generateSessionToken();
      req.user.sessionToken = sessionToken;
      await req.user.save();

      res.redirect(`http://localhost:3000/?token=${sessionToken}`);
    } catch (error) {
      console.error('Google Login Callback Error:', error);
      res.redirect('/views/home.html?error=login_failed&message=' + encodeURIComponent(error.message));
    }
  }
);

module.exports = router;