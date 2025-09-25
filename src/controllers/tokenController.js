const jwtService = require('../services/jwtService');
const discordService = require('../services/discordService');
const githubService = require('../services/githubService');
const schedulerService = require('../services/schedulerService');
const logger = require('../utils/logger');

class TokenController {
  async generateTokens(req, res) {
    try {
      logger.info('Manual token generation requested');
      
      const tokens = await jwtService.generateAllTokens();
      
      if (!tokens || tokens.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'No tokens generated'
        });
      }

      // Update GitHub repository
      const githubSuccess = await githubService.updateTokenFile(tokens);
      
      // Send notification to Discord
      const discordSuccess = await discordService.sendTokensToDiscord(tokens);

      res.json({
        success: true,
        message: 'Tokens generated successfully',
        data: {
          tokenCount: tokens.length,
          githubUpdated: githubSuccess,
          discordNotified: discordSuccess
        }
      });

    } catch (error) {
      logger.error('Error in generateTokens:', error);
      
      // Send error notification to Discord
      await discordService.sendErrorToDiscord(
        `Manual token generation failed: ${error.message}`
      );

      res.status(500).json({
        success: false,
        message: 'Failed to generate tokens',
        error: error.message
      });
    }
  }

  async getTokens(req, res) {
    try {
      const tokens = await jwtService.getGeneratedTokens();
      
      res.json({
        success: true,
        data: {
          tokens,
          count: tokens.length
        }
      });

    } catch (error) {
      logger.error('Error in getTokens:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tokens',
        error: error.message
      });
    }
  }

  async refreshTokens(req, res) {
    try {
      logger.info('Manual token refresh requested');
      
      await schedulerService.forceRefresh();
      
      res.json({
        success: true,
        message: 'Token refresh initiated'
      });

    } catch (error) {
      logger.error('Error in refreshTokens:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to refresh tokens',
        error: error.message
      });
    }
  }

  async getSchedulerStatus(req, res) {
    try {
      const status = schedulerService.getStatus();
      
      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      logger.error('Error in getSchedulerStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get scheduler status',
        error: error.message
      });
    }
  }

  async getGitHubTokens(req, res) {
    try {
      const tokens = await githubService.getCurrentTokens();
      
      res.json({
        success: true,
        data: {
          tokens,
          count: tokens ? tokens.length : 0
        }
      });

    } catch (error) {
      logger.error('Error in getGitHubTokens:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve GitHub tokens',
        error: error.message
      });
    }
  }

  async testGuestAccounts(req, res) {
    try {
      logger.info('Testing guest accounts loading...');
      const accounts = await jwtService.loadGuestAccounts();
      
      res.json({
        success: true,
        message: 'Guest accounts loaded successfully',
        data: {
          count: accounts.length,
          sample: accounts.slice(0, 3) // Show first 3 accounts
        }
      });

    } catch (error) {
      logger.error('Error in testGuestAccounts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load guest accounts',
        error: error.message
      });
    }
  }
}

module.exports = new TokenController();
