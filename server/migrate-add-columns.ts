import { pool } from "./db";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  try {
    console.log('Running migration to add Excel columns...');
    
    const migrationPath = path.join(process.cwd(), 'migrations', 'add-excel-columns.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migration complete! New columns added:');
    console.log('  - pros');
    console.log('  - cons');
    console.log('  - usage_description');
    console.log('  - related_projects');
    console.log('  - official_website');
    console.log('  - recommendation_score');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
