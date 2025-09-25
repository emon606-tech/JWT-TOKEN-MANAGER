const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const config = require('../utils/config');
const logger = require('../utils/logger');

class JWTService {
  constructor() {
    this.guestAccountsPath = path.join(__dirname, '../../data/guest_accounts.json');
    this.generatedTokensPath = path.join(__dirname, '../../data/generated_tokens.json');
    
    // Log the paths for debugging
    logger.info('Guest accounts path:', this.guestAccountsPath);
    logger.info('Generated tokens path:', this.generatedTokensPath);
  }

  async loadGuestAccounts() {
    // Try multiple possible paths
    const possiblePaths = [
      this.guestAccountsPath,
      path.join(process.cwd(), 'data/guest_accounts.json'),
      path.join(__dirname, '../../../data/guest_accounts.json'),
      './data/guest_accounts.json'
    ];

    let accounts = null;
    let usedPath = null;

    for (const filePath of possiblePaths) {
      try {
        await fs.access(filePath);
        logger.info(`Guest accounts file found at: ${filePath}`);
        const data = await fs.readFile(filePath, 'utf8');
        accounts = JSON.parse(data);
        usedPath = filePath;
        break;
      } catch (err) {
        logger.debug(`File not found at: ${filePath}`);
      }
    }

    if (!accounts) {
      logger.error('Error loading guest accounts: File not found');
      logger.error('File paths attempted:', possiblePaths);
      logger.error('Current working directory:', process.cwd());
      throw new Error('Guest accounts file not found in any expected location');
    }

    logger.info(`Successfully loaded ${accounts.length} guest accounts from: ${usedPath}`);
    return accounts;
  }

  generateJWT(guestAccount) {
    const payload = {
      account_id: this.generateAccountId(),
      nickname: this.generateNickname(),
      noti_region: "BD",
      lock_region: "BD",
      external_id: this.generateExternalId(),
      external_type: 4,
      plat_id: 1,
      client_version: "1.108.3",
      emulator_score: 100,
      is_emulator: true,
      country_code: "SG",
      external_uid: parseInt(guestAccount.uid),
      reg_avatar: 102000007,
      source: 4,
      lock_region_time: Math.floor(Date.now() / 1000),
      client_type: 2,
      signature_md5: "",
      using_version: 1,
      release_channel: "3rd_party",
      release_version: "OB50",
      exp: Math.floor(Date.now() / 1000) + (4 * 60 * 60) // 4 hours from now
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      algorithm: 'HS256',
      header: {
        alg: "HS256",
        svr: "1",
        typ: "JWT"
      }
    });

    return {
      token,
      payload
    };
  }

  generateAccountId() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }

  generateNickname() {
    const prefixes = ['Anta', 'Gunn', 'Micro', 'Soot', 'Joe', 'Beat', 'Pard', 'Rick', 'Nite', 'Bon', 'Lily', 'Gyro', 'Razor', 'Fall', 'Ash', 'Fish', 'Orca', 'Note', 'Merc', 'Anya', 'Mary', 'Mutant', 'Mole', 'Mess', 'Whiz', 'Poe', 'Fish', 'Retro', 'Cherub', 'Nug', 'Emi', 'King', 'Fry', 'Elk', 'Bone', 'Seal', 'Mantis', 'Retro', 'Note', 'Ave', 'Bone', 'Note', 'Path', 'Tacit', 'Star', 'Paige', 'Guy', 'Halo', 'Knee', 'Note', 'Fang', 'Note', 'Song', 'Cobalt', 'Note', 'Neo', 'Perma', 'Tee', 'Roll', 'Love', 'Note', 'Heavy', 'Path'];
    const suffixes = ['4?0r9O', '1v4n5', 'op0o1L5', '3t7m1)7_', '2p2F3', '1O6x0m', '7!2f4I', '9M7y2t4Y', 'N42aT4(9Z', '2@7n8s8', '8i1l0!', '2Q6X2x1d', '1Y4O2a1', '9T0x2X2l', '4a3f3fbc7', '3S6W4!0', '7F3M0T', '1@8a1w9', '9@6', '4bfa4af4de', '23562cb2f9', '0@4@3V5', '0n5E5', '6P6!2', '0Y2j1D1_0', '6a2j4B', '9k3G5&3', '8k7G5&3', '7j4N0T', '6s0a8R', '1o2b9', '8y4B', '9X9z4', '0B9t8', '7I3m7U', '0a9b97f', '9X9s4', '1q1D9Q', '3y1q4', '6n6O2', '9D0f9', '2q!3t6s6', '1a1l7Y', '0a9b97f', '9X9s4', '1q1D9Q', '3y1q4', '6n6O2', '9D0f9', '2q!3t6s6', '1a1l7Y'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  }

  generateExternalId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async generateAllTokens() {
    try {
      logger.info('Starting JWT token generation...');
      const guestAccounts = await this.loadGuestAccounts();
      const generatedTokens = [];

      for (const account of guestAccounts) {
        const { token, payload } = this.generateJWT(account);
        generatedTokens.push({ token });
      }

      // Save generated tokens
      await fs.writeFile(
        this.generatedTokensPath,
        JSON.stringify(generatedTokens, null, 2)
      );

      logger.info(`Generated ${generatedTokens.length} JWT tokens`);
      return generatedTokens;
    } catch (error) {
      logger.error('Error generating tokens:', error);
      throw error;
    }
  }

  async getGeneratedTokens() {
    try {
      const data = await fs.readFile(this.generatedTokensPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error loading generated tokens:', error);
      return [];
    }
  }
}

module.exports = new JWTService();
