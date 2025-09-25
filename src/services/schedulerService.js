const cron = require('node-cron');
const jwtService = require('./jwtService');
const discordService = require('./discordService');
const githubService = require('./githubService');
const config = require('../utils/config');
const logger = require('../utils/logger');

class SchedulerService {
  constructor() {
    this.cronJob = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }

    const cronExpression = config.scheduler.tokenRefreshInterval;
    
    this.cronJob = cron.schedule(cronExpression, async () => {
      await this.refreshTokens();
    }, {
      scheduled: false,
      timezone: "UTC"
    });

    this.cronJob.start();
    this.isRunning = true;
    
    logger.info(`Token refresh scheduler started with cron expression: ${cronExpression}`);
    
    // Run immediately on startup
    this.refreshTokens();
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    logger.info('Token refresh scheduler stopped');
  }

  async refreshTokens() {
    try {
      logger.info('Starting scheduled token refresh...');
      
      // Generate new tokens
      const tokens = await jwtService.generateAllTokens();
      
      if (!tokens || tokens.length === 0) {
        throw new Error('No tokens generated');
      }

      // Update GitHub repository
      const githubSuccess = await githubService.updateTokenFile(tokens);
      
      // Send notification to Discord
      const discordSuccess = await discordService.sendTokensToDiscord(tokens);
      
      logger.info('Token refresh completed successfully', {
        tokenCount: tokens.length,
        githubUpdated: githubSuccess,
        discordNotified: discordSuccess
      });

    } catch (error) {
      logger.error('Error during token refresh:', error);
      
      // Send error notification to Discord
      await discordService.sendErrorToDiscord(
        `Token refresh failed: ${error.message}`
      );
    }
  }

  async forceRefresh() {
    logger.info('Force refresh requested');
    await this.refreshTokens();
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.cronJob ? this.cronJob.nextDate() : null
    };
  }
}

module.exports = new SchedulerService();
