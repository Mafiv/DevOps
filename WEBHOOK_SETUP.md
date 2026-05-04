# Webhook Configuration Guide

This guide explains how to configure GitHub and Vercel webhooks for real-time updates.

## GitHub Webhooks

### Setting up GitHub Webhooks

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Webhooks**
3. Click **Add webhook**
4. Configure:
   - **Payload URL**: `https://your-api-domain.com/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Use the value from your `WEBHOOK_SECRET` environment variable
   - **Events**: Select "Workflow runs" and "Push" events

5. Click **Add webhook**

### Webhook Events Handled

- `workflow_run` - Triggered when GitHub Actions workflows complete
- `push` - Triggered when code is pushed to the repository

## Vercel Webhooks

### Setting up Vercel Webhooks

1. Go to your Vercel project settings
2. Navigate to **Git** → **Webhooks**
3. Click **Add webhook**
4. Configure:
   - **URL**: `https://your-api-domain.com/webhooks/vercel`
   - **Secret**: Use the value from your `WEBHOOK_SECRET` environment variable
5. Click **Add**

### Webhook Events Handled

- `deployment` - Triggered when deployments start, succeed, or fail

## Local Development

For local development, you can use ngrok to expose your local API server:

```bash
# Install ngrok
npm install -g ngrok

# Start your API server
cd packages/api && pnpm dev

# In another terminal, expose port 3001
ngrok http 3001

# Use the ngrok URL as your webhook URL
```

## Environment Variables

Ensure these are set in your `.env` file:

```env
WEBHOOK_SECRET=your_random_secret_string
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Testing Webhooks

You can test webhooks using curl:

```bash
# Test GitHub webhook
curl -X POST http://localhost:3001/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: workflow_run" \
  -H "X-Hub-Signature-256: sha256=..." \
  -d '{"action": "completed", "workflow_run": {...}}'

# Test Vercel webhook
curl -X POST http://localhost:3001/webhooks/vercel \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: ..." \
  -d '{"type": "deployment", "deployment": {...}}'
```
