import { db } from "./db";
import { users } from "@shared/schema";

async function listUsers() {
  try {
    const allUsers = await db.select({ username: users.username }).from(users);
    
    if (allUsers.length === 0) {
      console.log("No users found in database");
    } else {
      console.log("Users in database:");
      allUsers.forEach(user => {
        console.log(`  - ${user.username}`);
      });
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error("Error listing users:", error.message);
    process.exit(1);
  }
}

listUsers();
