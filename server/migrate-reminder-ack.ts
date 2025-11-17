import { db } from './db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Adding reminder acknowledgment columns...');

  try {
    await db.execute(sql`
      ALTER TABLE subscriptions 
      ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMP,
      ADD COLUMN IF NOT EXISTS reminder_acknowledged TIMESTAMP
    `);

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }

  process.exit(0);
}

migrate();
