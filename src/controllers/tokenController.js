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

  async testGitHubUpdate(req, res) {
    try {
      logger.info('Testing GitHub update...');
      
      // Generate a small test token set
      const testTokens = [
        { "token": "test-token-1" },
        { "token": "test-token-2" },
        { "token": "test-token-3" }
      ];
      
      const result = await githubService.updateTokenFile(testTokens);
      
      res.json({
        success: result,
        message: result ? 'GitHub update successful' : 'GitHub update failed',
        data: {
          tokenCount: testTokens.length,
          githubUpdated: result
        }
      });

    } catch (error) {
      logger.error('Error in testGitHubUpdate:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test GitHub update',
        error: error.message
      });
    }
  }

  async testDiscordFileUpload(req, res) {
    try {
      logger.info('Testing Discord file upload...');
      
      // Generate a small test token set
      const testTokens = [
        { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test1" },
        { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test2" },
        { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test3" }
      ];
      
      const result = await discordService.sendTokensToDiscord(testTokens);
      
      res.json({
        success: result,
        message: result ? 'Discord file upload successful' : 'Discord file upload failed',
        data: {
          tokenCount: testTokens.length,
          discordSent: result
        }
      });

    } catch (error) {
      logger.error('Error in testDiscordFileUpload:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test Discord file upload',
        error: error.message
      });
    }
  }
}

module.exports = new TokenController();
