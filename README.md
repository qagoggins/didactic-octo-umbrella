# Telegram Bot - Work Management

A Telegram bot for managing shifts, cycles, and work hours with bilingual support (English/Spanish).

## Features

- **Bilingual Support**: Choose between English and Spanish
- **Work Management**: Track breaks, cycles, shifts, and PTI
- **Hour Adjustments**: Adjust and add work hours
- **Webhook Support**: Production-ready with webhook support for DigitalOcean

## Local Development

### Prerequisites

- Node.js 18.x or higher
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Add your bot token to `.env`:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   NODE_ENV=development
   ```

5. Run the bot:
   ```bash
   npm run dev
   ```

The bot will start in polling mode for local development.

## Deployment to DigitalOcean App Platform

### Step 1: Prepare Your Repository

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Make sure `.env` is in `.gitignore` (already configured)

### Step 2: Create a New App on DigitalOcean

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your repository
4. Select the repository and branch

### Step 3: Configure the App

1. **Service Type**: Web Service
2. **Environment Variables**: Add the following in the App Platform settings:
   - `BOT_TOKEN`: Your Telegram bot token
   - `NODE_ENV`: `production`
   - `WEBHOOK_DOMAIN`: Your app URL (e.g., `https://your-app-name.ondigitalocean.app`)
   - `PORT`: `8080` (or use DigitalOcean's default)

3. **Build Command**: `npm install`
4. **Run Command**: `npm start`

### Step 4: Deploy

1. Click "Next" and review your settings
2. Click "Create Resources"
3. Wait for deployment to complete

### Step 5: Set the Webhook Domain

After the first deployment:

1. Copy your app's URL (e.g., `https://your-app-name.ondigitalocean.app`)
2. Go to App Settings → Environment Variables
3. Update `WEBHOOK_DOMAIN` with your app's URL
4. Redeploy the app

### Health Check

The app includes health check endpoints:
- `/` - Basic status check
- `/health` - Detailed health information

DigitalOcean will automatically use these endpoints to monitor your app.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BOT_TOKEN` | Telegram bot token from @BotFather | Yes | - |
| `NODE_ENV` | Environment (development/production) | No | development |
| `PORT` | Server port | No | 3000 |
| `WEBHOOK_DOMAIN` | Full URL for webhook (production only) | Yes (prod) | - |

## Bot Commands

- `/start` - Choose language and display menu

### Available Menu Options

**English:**
- Break
- Cycle (requires Bill of Lading)
- Shift
- PTI
- Adjust Hours
- Add a few hours

**Spanish:**
- Descanso
- Ciclo (requiere Conocimiento de Embarque)
- Turno
- PTI
- Ajustar Horas
- Agregar unas horas

## Architecture

- **Development Mode**: Uses Telegram polling to receive updates
- **Production Mode**: Uses webhooks for efficient message handling
- **Express Server**: Provides health check endpoints and webhook handler
- **Graceful Shutdown**: Handles SIGINT and SIGTERM signals properly

## Troubleshooting

### Bot not responding in production

1. Check that `WEBHOOK_DOMAIN` is set correctly
2. Verify the webhook URL is accessible: `https://your-app.ondigitalocean.app/health`
3. Check application logs in DigitalOcean console

### Webhook errors

If you see webhook errors, try:
1. Delete the webhook: Use Telegram's API or redeploy with `NODE_ENV=development` temporarily
2. Set it again by redeploying with correct `WEBHOOK_DOMAIN`

## License

ISC
