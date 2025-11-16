import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcryptjs";

async function createUser() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: npm run create-user <username> <password>");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    console.log(`✓ User created successfully!`);
    console.log(`  Username: ${user.username}`);
    console.log(`  ID: ${user.id}`);
    process.exit(0);
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
}

createUser();
