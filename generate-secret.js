const crypto = require('crypto');

console.log('🔐 JWT Secret Generator');
console.log('======================');
console.log('');

// Generate a secure 64-byte (128 character) hex string
const secret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret:');
console.log(secret);
console.log('');
console.log('📋 Add this to your .env file:');
console.log(`JWT_SECRET=${secret}`);
console.log('');
console.log('🔒 Security Notes:');
console.log('- This secret is 128 characters long');
console.log('- It\'s cryptographically secure');
console.log('- Keep it secret and never share it');
console.log('- Use different secrets for different environments');
