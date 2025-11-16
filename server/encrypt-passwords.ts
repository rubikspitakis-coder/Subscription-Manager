import { db, pool } from "./db";
import { subscriptions } from "@shared/schema";
import { encryptPassword, isEncrypted } from "./crypto";
import { eq } from "drizzle-orm";

/**
 * Migration script to encrypt existing plain-text passwords
 * Run this once after deploying the encryption feature
 * 
 * Usage: NODE_ENV=production tsx server/encrypt-passwords.ts
 */
async function encryptExistingPasswords() {
  console.log("Starting password encryption migration...");

  try {
    // Fetch all subscriptions
    const allSubscriptions = await db.select().from(subscriptions);
    console.log(`Found ${allSubscriptions.length} subscriptions`);

    let encryptedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const subscription of allSubscriptions) {
      // Skip if no password
      if (!subscription.password) {
        skippedCount++;
        continue;
      }

      // Check if already encrypted
      if (isEncrypted(subscription.password)) {
        console.log(`Subscription ${subscription.id} (${subscription.name}): Already encrypted`);
        skippedCount++;
        continue;
      }

      try {
        // Encrypt the password
        const encryptedPassword = encryptPassword(subscription.password);
        
        // Update the database
        await db
          .update(subscriptions)
          .set({ password: encryptedPassword })
          .where(eq(subscriptions.id, subscription.id));

        console.log(`Subscription ${subscription.id} (${subscription.name}): Password encrypted ✓`);
        encryptedCount++;
      } catch (error) {
        console.error(
          `Subscription ${subscription.id} (${subscription.name}): Failed to encrypt`,
          error
        );
        errorCount++;
      }
    }

    console.log("\n=== Migration Complete ===");
    console.log(`Total subscriptions: ${allSubscriptions.length}`);
    console.log(`Encrypted: ${encryptedCount}`);
    console.log(`Skipped (no password or already encrypted): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);

    if (errorCount > 0) {
      console.error("\n⚠️  Some passwords failed to encrypt. Please review the errors above.");
      process.exit(1);
    } else {
      console.log("\n✓ All passwords successfully encrypted!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
encryptExistingPasswords();
