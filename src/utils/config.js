module.exports = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  jwt: {
    secret: process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex'),
    expiresIn: process.env.JWT_EXPIRES_IN || '4h'
  },
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER || 'emon606-tech',
    repo: process.env.GITHUB_REPO || 'free-fire-like-api',
    filePath: process.env.GITHUB_FILE_PATH || 'tokens/token_bd.json'
  },
  scheduler: {
    tokenRefreshInterval: process.env.TOKEN_REFRESH_INTERVAL || '0 */4 * * *'
  }
};
