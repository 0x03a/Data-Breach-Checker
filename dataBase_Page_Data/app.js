require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const passwordController = require('./controllers/passwordController');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const contactRoutes = require('./routes/contact');

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

app.use(session({ 
  secret: 'your_secret', 
  resave: false, 
  saveUninitialized: false 
}));

// Session token validation middleware
app.use(async (req, res, next) => {
  if (req.session.user && req.session.user.id !== 'admin') {
    const user = await User.findById(req.session.user.id);
    if (!user || user.sessionToken !== req.session.user.sessionToken) {
      // Invalid session, destroy it
      req.session.destroy();
      return res.status(401).json({ error: 'Session expired' });
    }
  }
  next();
});

// Simple local MongoDB connection
mongoose.connect('mongodb://localhost:27017/data_breach_checker')
.then(async () => {
  console.log('Successfully connected to MongoDB.');
  // Initialize passwords from MOCK_DATA if database is empty
  await passwordController.initializePasswords();
  // Remove any existing user with the same email
  await User.deleteOne({ email: 'inshal@gmail.com' });
  // Then create the hardcoded admin user with hashed password
  const hashedPassword = await bcrypt.hash('@123insR', 10);
  await User.create({
    fullname: 'inshal',
    email: 'inshal@gmail.com',
    password: hashedPassword,
    isAdmin: true
  });
  console.log('Hardcoded admin user inshal@gmail.com created.');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});


console.log('ENV DEBUG:', {
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS ? '***' : undefined,
  MAIL_FROM: process.env.MAIL_FROM
});
// Routes
console.log('GMAIL_USEydR:', process.env.MAIL_USER);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);

// Serve home page
app.get('/', (req, res) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    // If admin, redirect to admin dashboard
    return res.redirect('/views/admin.html');
  }
  // Otherwise, show home page (user or guest)
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 