# AI Subscription Manager - Setup Guide

## Environment Variables

### Required for Production

#### `ENCRYPTION_SECRET`
**Required for secure password encryption in production.**

This environment variable is used to encrypt subscription passwords before storing them in the database.

**Generate a secure key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Setting in Railway:**
1. Go to your Railway project
2. Navigate to Variables tab
3. Add a new variable:
   - Name: `ENCRYPTION_SECRET`
   - Value: (paste the generated 64-character hex string)
4. Redeploy the application

**Note:** Without this variable, the application will use a default development key with a warning. This is NOT secure for production use.

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (automatically set by Railway)

## Local Development

For local development, create a `.env` file in the root directory:

```bash
ENCRYPTION_SECRET=your_64_character_hex_string_here
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Deployment

The application is configured for Railway deployment with automatic builds from the repository.

### First Time Deployment
1. Set up the `ENCRYPTION_SECRET` environment variable
2. Ensure DATABASE_URL is configured
3. Deploy the application
4. Database migrations will run automatically on startup
