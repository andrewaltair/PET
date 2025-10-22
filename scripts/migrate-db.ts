import * as fs from 'fs';
import * as path from 'path';
import { pool } from '../server/src/config/database';

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'config', 'database-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

    // Split into individual statements (simple approach)
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
      .filter(stmt => !stmt.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          await pool.query(statement);
          console.log('✅ Statement executed successfully');
        } catch (error: any) {
          // Log error but continue with other statements
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);

          // For certain types of errors, we can continue
          if (error.message.includes('already exists') ||
              error.message.includes('does not exist') ||
              error.message.includes('duplicate key')) {
            console.log('Continuing with next statement...');
            continue;
          }

          // For more serious errors, we might want to stop
          throw error;
        }
      }
    }

    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('💥 Database migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateDatabase();
