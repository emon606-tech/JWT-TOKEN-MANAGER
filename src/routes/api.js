const express = require('express');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

// Token management routes
router.post('/tokens/generate', tokenController.generateTokens);
router.get('/tokens', tokenController.getTokens);
router.post('/tokens/refresh', tokenController.refreshTokens);
router.get('/tokens/github', tokenController.getGitHubTokens);

// Test routes
router.get('/test/guest-accounts', tokenController.testGuestAccounts);

// Scheduler routes
router.get('/scheduler/status', tokenController.getSchedulerStatus);

module.exports = router;
