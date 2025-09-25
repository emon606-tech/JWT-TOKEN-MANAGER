# JWT Token Manager

A Node.js server that automatically generates JWT tokens from guest accounts, updates GitHub repositories, and sends notifications via Discord webhooks.

## Features

- 🔄 **Automatic Token Generation**: Converts guest accounts to JWT tokens
- ⏰ **Scheduled Updates**: Refreshes tokens every 4 hours
- 🐙 **GitHub Integration**: Updates token files in GitHub repositories
- 💬 **Discord Notifications**: Sends status updates via Discord webhooks
- 🚀 **Render Deployment**: Ready for deployment on Render.com

## Project Structure

```
jwt-token-manager/
├── src/
│   ├── controllers/          # Request handlers
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   └── utils/               # Utilities and config
├── data/
│   ├── guest_accounts.json  # Input guest accounts
│   └── generated_tokens.json # Generated JWT tokens
├── package.json
├── render.yaml              # Render deployment config
└── README.md
```

## API Endpoints

### Token Management
- `POST /api/tokens/generate` - Generate new JWT tokens
- `GET /api/tokens` - Get current generated tokens
- `POST /api/tokens/refresh` - Force refresh tokens
- `GET /api/tokens/github` - Get tokens from GitHub repository

### System
- `GET /api/scheduler/status` - Get scheduler status
- `GET /health` - Health check endpoint

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=4h

# Discord Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# GitHub Configuration
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=emon606-tech
GITHUB_REPO=free-fire-like-api
GITHUB_FILE_PATH=tokens/token_bd.json

# Scheduler Configuration
TOKEN_REFRESH_INTERVAL=0 */4 * * *  # Every 4 hours
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your configuration

5. Start the server:
   ```bash
   npm start
   ```

## Deployment on Render

1. Connect your GitHub repository to Render
2. The `render.yaml` file will automatically configure the deployment
3. Set your environment variables in the Render dashboard
4. Deploy!

## How It Works

1. **Token Generation**: Reads guest accounts from `data/guest_accounts.json`
2. **JWT Creation**: Generates JWT tokens with proper payload structure
3. **GitHub Update**: Updates the specified file in your GitHub repository
4. **Discord Notification**: Sends success/error notifications to Discord
5. **Scheduled Refresh**: Automatically refreshes tokens every 4 hours

## JWT Token Structure

Each generated JWT token contains:
- `account_id`: Randomly generated account ID
- `nickname`: Generated username
- `external_uid`: Matches the guest account UID
- `country_code`: Set to "SG"
- `region`: Set to "BD"
- `exp`: Expiration time (4 hours from generation)

## Monitoring

The server provides several monitoring endpoints:
- Health check at `/health`
- Scheduler status at `/api/scheduler/status`
- Token counts and generation status

## Logging

All operations are logged using Winston with different levels:
- `error`: Critical errors
- `warn`: Warnings
- `info`: General information
- `debug`: Detailed debugging information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
