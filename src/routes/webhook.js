const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// Discord webhook endpoint (for testing)
router.post('/discord', (req, res) => {
  logger.info('Discord webhook received:', req.body);
  res.status(200).json({ success: true });
});

// GitHub webhook endpoint (for future use)
router.post('/github', (req, res) => {
  logger.info('GitHub webhook received:', req.body);
  res.status(200).json({ success: true });
});

module.exports = router;
