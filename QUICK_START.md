# Quick Start Guide

## Immediate Next Steps

### 1. Install Dependencies
```powershell
npm install
```

This will remove the Replit-specific packages and install everything needed.

### 2. Generate Encryption Secret
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save this output securely** - you'll need it for both local development and Railway deployment!

### 3. Local Development (Optional)

If you want to test locally before deploying:

```powershell
# Copy the example env file
Copy-Item .env.example .env

# Edit .env and add:
# - Your local DATABASE_URL
# - The ENCRYPTION_SECRET you just generated
```

Then run:
```powershell
npm run dev
```

### 4. Deploy to Railway

See `RAILWAY_DEPLOYMENT.md` for complete instructions, or follow this quick version:

1. **Push to GitHub**:
   ```powershell
   git add .
   git commit -m "Add encryption and prepare for Railway"
   git push origin main
   ```

2. **Create Railway Project**:
   - Go to https://railway.app/new
   - Connect your GitHub repository
   - Add a PostgreSQL database

3. **Set Environment Variable**:
   - In Railway dashboard, go to Variables
   - Add `ENCRYPTION_SECRET` with the value you generated

4. **Deploy** (automatic after pushing to GitHub)

5. **Run Database Migrations**:
   ```powershell
   railway run npm run db:push
   ```

6. **If you have existing data with passwords**:
   ```powershell
   railway run npx tsx server/encrypt-passwords.ts
   ```

## Files You Can Delete

These are Replit-specific and no longer needed:
- `.replit` (can delete)
- `replit.md` (keep for reference if you want, but not needed)

## Important Security Notes

⚠️ **ENCRYPTION_SECRET**: 
- Never commit this to Git
- Back it up in a secure password manager
- Use the same value across all environments (local/Railway)
- If lost, encrypted passwords cannot be recovered

✅ **Passwords are now secure**:
- Stored encrypted in database
- Automatically encrypted on create/update
- Automatically decrypted when retrieved
- Uses AES-256-GCM encryption

## Need Help?

- **Railway Deployment**: See `RAILWAY_DEPLOYMENT.md`
- **Migration Details**: See `MIGRATION_NOTES.md`
- **Environment Setup**: See `.env.example`

## Verify Everything Works

After deploying to Railway:

1. Open your Railway URL
2. Try creating a subscription with a password
3. Edit it and retrieve it - password should work normally
4. Check your Railway logs for any errors

## Summary of Changes

✅ Removed Replit-specific code  
✅ Added AES-256-GCM password encryption  
✅ Updated .gitignore for better security  
✅ Created comprehensive documentation  
✅ Ready for Railway deployment  

Your app is now ready to deploy! 🚀
