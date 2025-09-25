const axios = require('axios');
const config = require('../utils/config');
const logger = require('../utils/logger');

class GitHubService {
  constructor() {
    this.token = config.github.token;
    this.owner = config.github.owner;
    this.repo = config.github.repo;
    this.filePath = config.github.filePath;
    this.baseUrl = 'https://api.github.com';
  }

  async updateTokenFile(tokens) {
    if (!this.token) {
      logger.warn('GitHub token not configured');
      return false;
    }

    try {
      logger.info(`Updating GitHub file: ${this.filePath}`);
      logger.info(`Repository: ${this.owner}/${this.repo}`);
      logger.info(`Token count to upload: ${tokens.length}`);
      
      // Get current file content and SHA
      const fileUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`;
      logger.info(`GitHub API URL: ${fileUrl}`);
      
      let currentSha = null;
      try {
        const fileResponse = await axios.get(fileUrl, {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        currentSha = fileResponse.data.sha;
        logger.info(`Found existing file with SHA: ${currentSha}`);
      } catch (error) {
        if (error.response?.status !== 404) {
          logger.error('Error getting file info:', error.response?.data || error.message);
          throw error;
        }
        // File doesn't exist, we'll create it
        logger.info('File does not exist, will create new one');
      }

      // Prepare new content
      const content = JSON.stringify(tokens, null, 2);
      const encodedContent = Buffer.from(content).toString('base64');
      
      logger.info(`Content size: ${content.length} characters`);
      logger.info(`Encoded size: ${encodedContent.length} characters`);

      // Update file
      const updateData = {
        message: `Update JWT tokens - ${new Date().toISOString()}`,
        content: encodedContent,
        committer: {
          name: 'JWT Token Manager',
          email: 'noreply@jwt-manager.com'
        }
      };

      if (currentSha) {
        updateData.sha = currentSha;
        logger.info('Updating existing file');
      } else {
        logger.info('Creating new file');
      }

      logger.info('Sending request to GitHub API...');
      const response = await axios.put(fileUrl, updateData, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      });

      logger.info(`GitHub API response status: ${response.status}`);
      logger.info(`GitHub API response data:`, response.data);

      if (response.status === 200 || response.status === 201) {
        logger.info('Successfully updated GitHub repository with new tokens');
        return true;
      } else {
        logger.warn(`GitHub API returned status: ${response.status}`);
        logger.warn(`Response data:`, response.data);
        return false;
      }
    } catch (error) {
      logger.error('Error updating GitHub repository:', error.message);
      if (error.response) {
        logger.error('GitHub API error response:', error.response.data);
        logger.error('GitHub API error status:', error.response.status);
      }
      return false;
    }
  }

  async getCurrentTokens() {
    if (!this.token) {
      logger.warn('GitHub token not configured');
      return null;
    }

    try {
      const fileUrl = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`;
      
      const response = await axios.get(fileUrl, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.response?.status === 404) {
        logger.info('Token file does not exist in repository');
        return null;
      }
      logger.error('Error fetching current tokens from GitHub:', error);
      return null;
    }
  }
}

module.exports = new GitHubService();
