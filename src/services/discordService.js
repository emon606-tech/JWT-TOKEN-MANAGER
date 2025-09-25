const axios = require('axios');
const config = require('../utils/config');
const logger = require('../utils/logger');

class DiscordService {
  constructor() {
    this.webhookUrl = config.discord.webhookUrl;
  }

  async sendTokensToDiscord(tokens) {
    if (!this.webhookUrl) {
      logger.warn('Discord webhook URL not configured');
      return false;
    }

    try {
      const embed = {
        title: "🔄 JWT Tokens Generated",
        description: `Successfully generated ${tokens.length} JWT tokens`,
        color: 0x00ff00, // Green color
        fields: [
          {
            name: "📊 Token Count",
            value: tokens.length.toString(),
            inline: true
          },
          {
            name: "⏰ Generated At",
            value: new Date().toISOString(),
            inline: true
          },
          {
            name: "🔄 Refresh Interval",
            value: "Every 4 hours",
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "JWT Token Manager"
        }
      };

      const payload = {
        embeds: [embed]
      };

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 204) {
        logger.info('Successfully sent token notification to Discord');
        return true;
      } else {
        logger.warn(`Discord webhook returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      logger.error('Error sending to Discord webhook:', error);
      return false;
    }
  }

  async sendErrorToDiscord(errorMessage) {
    if (!this.webhookUrl) {
      logger.warn('Discord webhook URL not configured');
      return false;
    }

    try {
      const embed = {
        title: "❌ JWT Token Generation Error",
        description: errorMessage,
        color: 0xff0000, // Red color
        timestamp: new Date().toISOString(),
        footer: {
          text: "JWT Token Manager"
        }
      };

      const payload = {
        embeds: [embed]
      };

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      logger.info('Successfully sent error notification to Discord');
      return true;
    } catch (error) {
      logger.error('Error sending error notification to Discord:', error);
      return false;
    }
  }
}

module.exports = new DiscordService();
