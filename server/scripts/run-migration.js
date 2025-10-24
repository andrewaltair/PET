#!/usr/bin/env node

/**
 * Run MySQL migration script
 * Usage: node run-migration.js <migration-file>
 * Example: node run-migration.js add_admin_role.sql
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function runMigration() {
  const migrationFile = process.argv[2];
  
  if (!migrationFile) {
    console.error('❌ Error: Please provide a migration file name');
    console.log('Usage: node run-migration.js <migration-file>');
    process.exit(1);
  }

  const migrationPath = path.join(__dirname, '../migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Parse DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const url = new URL(databaseUrl);
  const config = {
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
    multipleStatements: true,
  };

  console.log('📊 Connecting to MySQL database...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}`);

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    console.log(`\n📝 Running migration: ${migrationFile}`);
    console.log('─────────────────────────────────────────');
    
    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      
      try {
        await connection.query(statement);
        console.log('✅ Statement executed successfully');
      } catch (error) {
        // Some errors are acceptable (like "already exists")
        if (error.message.includes('already exists') || 
            error.message.includes('Duplicate column')) {
          console.log('⚠️  Warning:', error.message);
          console.log('   Continuing...');
        } else {
          throw error;
        }
      }
    }

    console.log('\n─────────────────────────────────────────');
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

runMigration();

