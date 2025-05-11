const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Password = require('../models/Password');

const MOCK_DATA_PATH = path.join(__dirname, '..', 'MOCK_DATA.json');

// Password validation regex - same as used in admin interface
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validatePassword(password) {
  if (!passwordPattern.test(password)) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.'
    };
  }
  return { valid: true };
}

async function loadPasswords() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/data_breach_checker');
    console.log('Connected to MongoDB');

    // Read MOCK_DATA.json
    const data = JSON.parse(fs.readFileSync(MOCK_DATA_PATH));
    console.log(`Found ${data.length} passwords in MOCK_DATA.json`);

    // Clear existing passwords
    await Password.deleteMany({});
    console.log('Cleared existing passwords');

    // Validate and filter passwords
    const validPasswords = [];
    const invalidPasswords = [];

    data.forEach(item => {
      const validation = validatePassword(item.Password);
      if (validation.valid) {
        validPasswords.push({ password: item.Password });
      } else {
        invalidPasswords.push({
          password: item.Password,
          error: validation.error
        });
      }
    });

    // Log validation results
    console.log(`Valid passwords: ${validPasswords.length}`);
    console.log(`Invalid passwords: ${invalidPasswords.length}`);
    
    if (invalidPasswords.length > 0) {
      console.log('\nInvalid passwords:');
      invalidPasswords.forEach(pw => {
        console.log(`- ${pw.password}: ${pw.error}`);
      });
    }

    // Insert valid passwords
    if (validPasswords.length > 0) {
      await Password.insertMany(validPasswords);
      console.log(`\nSuccessfully loaded ${validPasswords.length} valid passwords into database`);
    } else {
      console.log('\nNo valid passwords to load into database');
    }

    // Verify the count
    const count = await Password.countDocuments();
    console.log(`Total passwords in database: ${count}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

loadPasswords(); 