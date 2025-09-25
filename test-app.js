const jwtService = require('./src/services/jwtService');
const discordService = require('./src/services/discordService');
const githubService = require('./src/services/githubService');

async function testApplication() {
  console.log('🧪 Testing JWT Token Manager Application...\n');

  try {
    // Test 1: Load guest accounts
    console.log('1️⃣ Testing guest account loading...');
    const accounts = await jwtService.loadGuestAccounts();
    console.log(`✅ Loaded ${accounts.length} guest accounts\n`);

    // Test 2: Generate JWT tokens
    console.log('2️⃣ Testing JWT token generation...');
    const tokens = await jwtService.generateAllTokens();
    console.log(`✅ Generated ${tokens.length} JWT tokens\n`);

    // Test 3: Test Discord webhook (optional - will fail if webhook URL not set)
    console.log('3️⃣ Testing Discord webhook...');
    const discordResult = await discordService.sendTokensToDiscord(tokens);
    console.log(`✅ Discord webhook: ${discordResult ? 'Success' : 'Failed (check webhook URL)'}\n`);

    // Test 4: Test GitHub integration (optional - will fail if token not set)
    console.log('4️⃣ Testing GitHub integration...');
    const githubResult = await githubService.updateTokenFile(tokens);
    console.log(`✅ GitHub update: ${githubResult ? 'Success' : 'Failed (check GitHub token)'}\n`);

    console.log('🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log(`- Guest accounts loaded: ${accounts.length}`);
    console.log(`- JWT tokens generated: ${tokens.length}`);
    console.log(`- Discord notification: ${discordResult ? 'Sent' : 'Skipped'}`);
    console.log(`- GitHub update: ${githubResult ? 'Updated' : 'Skipped'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testApplication();
