import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function updatePassword() {
  const username = process.argv[2];
  const newPassword = process.argv[3];

  if (!username || !newPassword) {
    console.error("Usage: npm run update-password <username> <new-password>");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const [updatedUser] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, username))
      .returning();

    if (!updatedUser) {
      console.error(`✗ User '${username}' not found`);
      process.exit(1);
    }

    console.log(`✓ Password updated successfully for user: ${updatedUser.username}`);
    process.exit(0);
  } catch (error: any) {
    console.error("Error updating password:", error.message);
    process.exit(1);
  }
}

updatePassword();
