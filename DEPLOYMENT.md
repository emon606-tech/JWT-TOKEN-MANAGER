# Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Test Locally**
   ```bash
   node test-app.js
   ```

4. **Start Server**
   ```bash
   npm start
   ```

## Render.com Deployment

### Method 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect the `render.yaml` file
4. Set your environment variables in the Render dashboard
5. Deploy!

### Method 2: Manual Configuration

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Add these environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   DISCORD_WEBHOOK_URL=your-discord-webhook
   GITHUB_TOKEN=your-github-token
   GITHUB_OWNER=emon606-tech
   GITHUB_REPO=free-fire-like-api
   GITHUB_FILE_PATH=tokens/token_bd.json
   TOKEN_REFRESH_INTERVAL=0 */4 * * *
   ```

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `DISCORD_WEBHOOK_URL` | Discord webhook URL | `https://discord.com/api/webhooks/...` |
| `GITHUB_TOKEN` | GitHub personal access token | `ghp_...` |
| `GITHUB_OWNER` | GitHub username/organization | `emon606-tech` |
| `GITHUB_REPO` | Repository name | `free-fire-like-api` |
| `GITHUB_FILE_PATH` | Path to token file in repo | `tokens/token_bd.json` |

## Testing After Deployment

1. **Health Check**
   ```bash
   curl https://your-app.onrender.com/health
   ```

2. **Generate Tokens**
   ```bash
   curl -X POST https://your-app.onrender.com/api/tokens/generate
   ```

3. **Check Scheduler Status**
   ```bash
   curl https://your-app.onrender.com/api/scheduler/status
   ```

## Monitoring

- Check Render logs for any errors
- Monitor Discord webhook for notifications
- Verify GitHub repository updates
- Use the health check endpoint for uptime monitoring

## Troubleshooting

### Common Issues

1. **JWT Generation Fails**
   - Check if `data/guest_accounts.json` exists
   - Verify file permissions

2. **Discord Webhook Fails**
   - Verify webhook URL is correct
   - Check Discord server permissions

3. **GitHub Update Fails**
   - Verify GitHub token has repo write permissions
   - Check repository path is correct

4. **Scheduler Not Running**
   - Check Render logs for cron job errors
   - Verify `TOKEN_REFRESH_INTERVAL` format

### Logs

- Application logs: Available in Render dashboard
- File logs: Check `logs/` directory (if accessible)
- Console logs: Visible in Render build logs
