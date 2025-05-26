// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Ideally use a database or hashed credentials in real-world apps
const VALID_USERNAME = process.env.SERVER_USERNAME;
const VALID_PASSWORD = process.env.SERVER_PASSWORD;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // You can issue a JWT token here or set a cookie
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;
