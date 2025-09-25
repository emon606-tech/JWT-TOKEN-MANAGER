const axios = require('axios');
const FormData = require('form-data');
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
      // Create the embed message
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

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add the embed as JSON
      formData.append('payload_json', JSON.stringify({
        embeds: [embed],
        content: `📁 **JWT Tokens File Attached**\n\nGenerated ${tokens.length} JWT tokens. Check the attached file for the complete token list.`
      }));

      // Create the tokens file content
      const tokensJson = JSON.stringify(tokens, null, 2);
      const tokensBuffer = Buffer.from(tokensJson, 'utf8');
      
      // Add the file attachment
      formData.append('file', tokensBuffer, {
        filename: `jwt_tokens_${new Date().toISOString().split('T')[0]}.json`,
        contentType: 'application/json'
      });

      logger.info(`Sending ${tokens.length} tokens to Discord as file attachment`);
      logger.info(`File size: ${tokensBuffer.length} bytes`);

      const response = await axios.post(this.webhookUrl, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });

      if (response.status === 204) {
        logger.info('Successfully sent token notification with file attachment to Discord');
        return true;
      } else {
        logger.warn(`Discord webhook returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      logger.error('Error sending to Discord webhook:', error);
      if (error.response) {
        logger.error('Discord API error response:', error.response.data);
      }
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
