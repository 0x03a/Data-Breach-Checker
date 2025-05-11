const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: { type: String, unique: true }, // hashed
  isAdmin: { type: Boolean, default: false },
  sessionToken: { type: String, default: null } // Store the current active session token
});
module.exports = mongoose.model('User', userSchema); 