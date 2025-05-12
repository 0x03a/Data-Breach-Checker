require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const passport = require('passport'); // CORRECT way to require passport
require('./passport-setup'); // Ensure Google strategy is registered

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const passwordController = require('./controllers/passwordController');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));

// Session config
app.use(session({ 
  secret: 'your_secret', 
  resave: false, 
  saveUninitialized: false 
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Session token validation middleware
app.use(async (req, res, next) => {
  if (req.session.user && req.session.user.id !== 'admin') {
    const user = await User.findById(req.session.user.id);
    if (!user || user.sessionToken !== req.session.user.sessionToken) {
      req.session.destroy();
      return res.status(401).json({ error: 'Session expired' });
    }
  }
  next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/data_breach_checker')
.then(async () => {
  console.log('Successfully connected to MongoDB.');
  
  await passwordController.initializePasswords();
  
  const existingAdmin = await User.findOne({ email: 'inshal@gmail.com' });
  if (!existingAdmin) {
    const initialAdminPassword = '@123insR';
    const hashedPassword = await bcrypt.hash(initialAdminPassword, 10);
    await User.create({
      fullname: 'inshal',
      email: 'inshal@gmail.com',
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Hardcoded admin user inshal@gmail.com created.');
  }
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return res.redirect('/views/admin.html');
  }
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! ' + err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
