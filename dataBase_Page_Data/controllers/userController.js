const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Password = require('../models/Password');





exports.createUser = async (req, res) => {
  try {
    const { fullname, email, password, isAdmin } = req.body;
    // Prevent any user with admin's email except the one allowed
    if (isAdmin) {
      // Only allow admin creation if no admin exists and email matches
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount > 0 || email !== 'inshal@gmail.com') {
        return res.status(400).json({ error: 'Cannot create another admin user.' });
      }
    }
    // Email must be unique
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    // Password must be unique (hashed)
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingPassword = await User.findOne({ password: hashedPassword });
    if (existingPassword) {
      return res.status(400).json({ error: 'Password already exists.' });
    }
    const user = new User({ fullname, email, password: hashedPassword, isAdmin: !!isAdmin });
    await user.save();
    // Add plain password to breach password collection
    await Password.create({ password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.updateUser = async (req, res) => {
  const { fullname, email, password, isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  // Only allow admin update for the admin user
  if (user.isAdmin) {
    // Email can be updated, but must remain unique and not become another admin
    if (email && email !== user.email) {
      if (email !== 'inshal@gmail.com') {
        return res.status(400).json({ error: 'Admin email must remain the designated admin email.' });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
      user.email = email;
    }
    if (fullname) user.fullname = fullname;
    if (typeof isAdmin !== 'undefined') user.isAdmin = true; // Always true for admin
    if (password) {
      // Password validation
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordPattern.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.' });
      }
      user.password = await bcrypt.hash(password, 10);
      await Password.create({ password }); // Add to breach password
    }
    await user.save();
    return res.json(user);
  } else {
    // For non-admin users, normal update
    const update = { fullname, email, isAdmin };
    if (password) update.password = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.json(updatedUser);
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user && user.isAdmin) {
    return res.status(400).json({ error: 'Cannot delete the admin user.' });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}; 