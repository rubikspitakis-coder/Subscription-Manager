# Migration Notes - Replit to Railway

## Changes Made

### 1. Removed Replit-Specific Configuration

**Files Modified:**
- `vite.config.ts` - Removed Replit Vite plugins
- `package.json` - Removed `@replit/*` dev dependencies

**Files to Remove/Ignore:**
- `.replit` - Replit configuration (no longer needed)
- `replit.md` - Replit documentation (can be kept for reference)

### 2. Added Password Encryption

**Security Enhancement:** All subscription passwords are now encrypted at rest using AES-256-GCM encryption.

**New Files:**
- `server/crypto.ts` - Encryption/decryption utilities
- `server/encrypt-passwords.ts` - One-time migration script for existing passwords
- `.env.example` - Template for environment variables

**Modified Files:**
- `server/storage.ts` - Automatically encrypts passwords on create/update, decrypts on read

**How it works:**
1. Passwords are encrypted using AES-256-GCM before storing in the database
2. Each encrypted password includes a random IV and authentication tag
3. Decryption happens automatically when retrieving subscriptions
4. The encryption key is derived from the `ENCRYPTION_SECRET` environment variable

### 3. Environment Variables

**New Required Variable:**
- `ENCRYPTION_SECRET` - 32-byte hex string for password encryption

**Existing Variables:**
- `DATABASE_URL` - PostgreSQL connection string (provided by Railway)
- `PORT` - Server port (auto-set by Railway)
- `NODE_ENV` - Environment mode (auto-set by Railway)

### 4. Documentation

**New Files:**
- `RAILWAY_DEPLOYMENT.md` - Complete Railway deployment guide
- `.env.example` - Environment variable template
- `MIGRATION_NOTES.md` - This file

## Migration Checklist

- [x] Remove Replit-specific code
- [x] Add password encryption
- [x] Create migration script for existing passwords
- [x] Document environment variables
- [x] Update `.gitignore`
- [ ] Install dependencies: `npm install`
- [ ] Generate encryption secret
- [ ] Create `.env` file (copy from `.env.example`)
- [ ] Test locally
- [ ] Deploy to Railway
- [ ] Run database migrations
- [ ] Run password encryption migration (if needed)

## Next Steps

### Before Deploying:

1. **Install dependencies** (removes unused Replit packages):
   ```bash
   npm install
   ```

2. **Generate encryption secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Save this securely - you'll need it for Railway!

3. **Test locally** (optional):
   - Copy `.env.example` to `.env`
   - Fill in your local database URL and encryption secret
   - Run: `npm run dev`
   - Test creating/editing subscriptions with passwords

### Railway Deployment:

Follow the detailed guide in `RAILWAY_DEPLOYMENT.md`, but here's the quick version:

1. **Create Railway project** and add PostgreSQL database
2. **Set environment variables**:
   - `ENCRYPTION_SECRET` (the one you generated)
   - `DATABASE_URL` is auto-configured
3. **Deploy** via GitHub or Railway CLI
4. **Run migrations**:
   ```bash
   railway run npm run db:push
   ```
5. **Encrypt existing passwords** (if you have data):
   ```bash
   railway run npx tsx server/encrypt-passwords.ts
   ```

## Breaking Changes

⚠️ **Important:** After deploying with encryption:

1. **All new passwords will be encrypted automatically**
2. **Existing plain-text passwords must be migrated** using `server/encrypt-passwords.ts`
3. **The `ENCRYPTION_SECRET` must remain constant** - changing it will make existing encrypted passwords unreadable
4. **Back up your `ENCRYPTION_SECRET`** - without it, passwords cannot be decrypted

## Security Improvements

✅ **Before:** Passwords stored in plain text
✅ **After:** Passwords encrypted with AES-256-GCM

✅ **Before:** No encryption key management
✅ **After:** Encryption key stored securely as environment variable

✅ **Before:** Replit-specific dev tools loaded in production
✅ **After:** Clean production build with no dev dependencies

## Testing

### Test Password Encryption Locally

```bash
# Create a test subscription with a password
curl -X POST http://localhost:5000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Service",
    "renewalDate": "2025-12-31T00:00:00Z",
    "password": "my-secret-password"
  }'

# Retrieve it - password should be decrypted
curl http://localhost:5000/api/subscriptions
```

### Verify Encryption in Database

Connect to your database and check the `subscriptions` table:
```sql
SELECT id, name, password FROM subscriptions;
```

The `password` column should contain base64-encoded encrypted data, not plain text.

## Rollback Plan

If you need to rollback:

1. **Code:** Revert the Git commits
2. **Database:** Passwords will remain encrypted - you'll need the same `ENCRYPTION_SECRET`
3. **If encryption secret is lost:** You'll need to manually reset passwords in the database

## Support

- See `RAILWAY_DEPLOYMENT.md` for detailed deployment instructions
- Check Railway logs for any deployment issues
- Review `server/crypto.ts` for encryption implementation details
