const Password = require('../models/Password');
const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '..', 'MOCK_DATA.json');

// Helper function to sync file with database
async function syncFileWithDatabase() {
  try {
    const passwords = await Password.find();
    const data = passwords.map(pw => ({ Password: pw.password }));
    fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error syncing file with database:', error);
  }
}

// Initialize database with MOCK_DATA on startup
exports.initializePasswords = async () => {
  try {
    const count = await Password.countDocuments();
    if (count === 0) {
      if (!fs.existsSync(MOCK_DATA_PATH)) {
        console.log('MOCK_DATA.json not found, creating with empty array');
        fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify([], null, 2));
      }
      const data = JSON.parse(fs.readFileSync(MOCK_DATA_PATH));
      if (data.length > 0) {
        await Password.insertMany(data.map(item => ({ password: item.Password })));
        console.log('Initialized passwords from MOCK_DATA');
      }
    }
  } catch (error) {
    console.error('Error initializing passwords:', error);
  }
};

exports.importPasswords = async (req, res) => {
  try {
    if (!fs.existsSync(MOCK_DATA_PATH)) {
      return res.status(404).json({ error: 'MOCK_DATA.json not found' });
    }
    const data = JSON.parse(fs.readFileSync(MOCK_DATA_PATH));
    await Password.deleteMany({});
    await Password.insertMany(data.map(item => ({ password: item.Password })));
    res.json({ success: true, count: data.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const newPassword = await Password.create({ password });
    await syncFileWithDatabase();
    res.json(newPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePassword = async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    await syncFileWithDatabase();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// KMP Algorithm for substring search
function computeLPS(pattern) {
  const m = pattern.length;
  const LPS = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      LPS[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = LPS[len - 1];
      } else {
        LPS[i] = 0;
        i++;
      }
    }
  }
  return LPS;
}

function searchKMP(txt, pattern) {
  if (!pattern) return true;
  const n = txt.length;
  const m = pattern.length;
  if (m === 0) return true;
  const LPS = computeLPS(pattern);
  let i = 0, j = 0;
  while (i < n) {
    if (txt[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === m) {
      return true;
    } else if (i < n && txt[i] !== pattern[j]) {
      if (j !== 0) {
        j = LPS[j - 1];
      } else {
        i++;
      }
    }
  }
  return false;
}

// Password strength validation
function isStrongPassword(password) {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return passwordPattern.test(password);
}

// API endpoint to check if password is breached
exports.checkPasswordBreach = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ breached: false, message: 'Password cannot be empty.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ breached: false, message: 'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.' });
    }
    const all = await Password.find();
    const found = all.some(pw => searchKMP(pw.password, password));
    if (found) {
      return res.json({ breached: true, message: 'The password you entered is breached. Please choose another.' });
    } else {
      return res.json({ breached: false, message: 'The password is safe.' });
    }
  } catch (error) {
    res.status(500).json({ breached: false, message: 'Server error.' });
  }
}; 