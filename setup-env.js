const fs = require('fs');
const crypto = require('crypto');

console.log('🔧 Setting up .env file for JWT Token Manager');
console.log('==============================================');
console.log('');

// Use your provided JWT secret
const jwtSecret = 'e0d1aa5fcc75b76942258e9ed122b363c3f580765d8997f5ccaa18f6ba6c7966a6eb15eea81e1cc0e09ff69c7dc46751ffc15b8d8a5f31483ef6fabf13bcc559';

// Environment configuration
const envContent = `# JWT Token Manager Environment Configuration
# Generated on: ${new Date().toISOString()}

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
# Generated secure secret (128 characters)
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=4h

# Discord Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1419650642955468942/kISe1BKybH6UbqRab1PqtFQlbljnoe87umayipGZekAktPMdUcfD5OdYX-F4ITzdP9ek

# GitHub Configuration
GITHUB_TOKEN=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
GITHUB_OWNER=emon606-tech
GITHUB_REPO=free-fire-like-api
GITHUB_FILE_PATH=tokens/token_bd.json

# Scheduler Configuration
TOKEN_REFRESH_INTERVAL=0 */4 * * *

# Logging
LOG_LEVEL=info
`;

try {
  // Write .env file
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📋 Generated JWT Secret:');
  console.log(jwtSecret);
  console.log('');
  console.log('🚀 You can now start the application with:');
  console.log('   npm start');
  console.log('');
  console.log('📝 For Render deployment, use these environment variables:');
  console.log('   JWT_SECRET=' + jwtSecret);
  console.log('   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1419650642955468942/kISe1BKybH6UbqRab1PqtFQlbljnoe87umayipGZekAktPMdUcfD5OdYX-F4ITzdP9ek');
  console.log('   GITHUB_TOKEN=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');
  console.log('   GITHUB_OWNER=emon606-tech');
  console.log('   GITHUB_REPO=free-fire-like-api');
  console.log('   GITHUB_FILE_PATH=tokens/token_bd.json');
  console.log('   TOKEN_REFRESH_INTERVAL=0 */4 * * *');
  console.log('   LOG_LEVEL=info');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('');
  console.log('📝 Manual setup:');
  console.log('1. Create a file named .env');
  console.log('2. Copy the content from env.production');
  console.log('3. Update any values as needed');
}
