import * as fs from 'fs';
import * as path from 'path';
import { pool } from '../server/src/config/database';

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'config', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log('Executed statement successfully');
        } catch (error) {
          // Ignore errors for CREATE EXTENSION IF NOT EXISTS, etc.
          if (!statement.includes('CREATE EXTENSION') &&
              !statement.includes('CREATE TYPE') &&
              !statement.includes('CREATE OR REPLACE FUNCTION')) {
            console.error('Error executing statement:', statement.substring(0, 100) + '...');
            throw error;
          }
        }
      }
    }

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

