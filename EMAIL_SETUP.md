# Email Reminder Setup

## Overview
Your AI Subscription Manager can send email reminders for upcoming renewals using [Resend](https://resend.com) - a modern email API.

## Setup Steps

### 1. Create a Resend Account (Free)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

**Free Tier Includes:**
- 100 emails per day
- 3,000 emails per month
- No credit card required

### 2. Get Your API Key

1. Log into your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name like "Subscription Manager"
5. Copy the API key (starts with `re_`)

### 3. Add API Key to Environment

#### Local Development:
```bash
# Add to your .env file
RESEND_API_KEY=re_your_actual_api_key_here
```

#### Railway Deployment:
1. Open your Railway project
2. Go to **Variables** tab
3. Click **New Variable**
4. Name: `RESEND_API_KEY`
5. Value: `re_your_actual_api_key_here`
6. Click **Add**

### 4. Test Email Sending

Run the test script to send yourself a test email:

```bash
npm run test-email
```

This will send a test reminder to `tim@timhuggins.com.au`.

## How It Works

### Sending Reminders from Dashboard

1. Open any subscription card
2. Click the **Send Now** button (envelope icon)
3. Email will be sent to your configured email address
4. Check your inbox (and spam folder)

### Email Content

The reminder email includes:
- 🔔 Subscription name
- 📅 Renewal date
- ⏰ Days until renewal  
- 💰 Cost and billing period
- 🔗 Link to official website (if available)
- Beautiful HTML design with gradient header

### Example Email

```
Subject: ⏰ Reminder: ChatGPT Plus renewal in 15 days

[Gradient Header]
🔔 Subscription Renewal Reminder

ChatGPT Plus

Renewal Date: February 1, 2025
Days Until Renewal: 15 days
Cost: $20/month

Visit ChatGPT Plus website →
```

## Troubleshooting

### Email Not Sending?

1. **Check API Key is Set**
   ```bash
   # Local
   echo $RESEND_API_KEY
   
   # Railway
   railway variables
   ```

2. **Verify API Key is Valid**
   - Go to Resend dashboard
   - Check if key is still active
   - Create a new key if needed

3. **Check Logs**
   - Local: Check terminal output
   - Railway: Check deployment logs

### Emails Going to Spam?

For production use with your own domain:

1. **Verify Your Domain** in Resend dashboard
2. **Add DNS Records** provided by Resend
3. **Update Email Service** to use your domain:
   ```typescript
   // In server/email.ts, change:
   from: 'Subscription Tracker <noreply@yourdomain.com>'
   ```

### Rate Limits

Free tier limits:
- 100 emails/day
- 3,000 emails/month

If you exceed limits, upgrade your Resend plan.

## Security Notes

- ✅ API keys are stored in environment variables (never in code)
- ✅ Keys are never committed to Git
- ✅ Email service fails gracefully if not configured
- ✅ User receives clear error messages

## Automated Reminders (Future Enhancement)

To set up daily automated reminders:

1. Add a cron job or scheduled task
2. Check for subscriptions expiring soon
3. Send reminder emails automatically

This can be implemented with:
- Railway cron jobs
- GitHub Actions scheduled workflows
- Node-cron package

## Support

Having issues? Check:
- [Resend Documentation](https://resend.com/docs)
- [Resend Status Page](https://status.resend.com)
- Your Railway deployment logs
