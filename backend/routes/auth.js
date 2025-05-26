const express = require('express');
const router = express.Router();

const VALID_USERNAME = process.env.SERVER_USERNAME;
const VALID_PASSWORD = process.env.SERVER_PASSWORD;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password' });
});

module.exports = router;
