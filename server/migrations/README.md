# Database Migrations

This directory contains SQL migration files for manual database updates.

## Migration Files

### add_admin_role.sql
Adds the ADMIN role to the UserRole enum in the users table.

**To run:**
```bash
# Option 1: Using MySQL command line
mysql -u your_username -p your_database < server/migrations/add_admin_role.sql

# Option 2: Using MySQL Workbench or other GUI
# Open the file and execute it in your MySQL client

# Option 3: Using Node.js script
node server/scripts/run-migration.js add_admin_role.sql
```

**What it does:**
- Modifies the `role` column in the `users` table to accept 'ADMIN' as a valid value
- Updates the ENUM from `('OWNER', 'PROVIDER')` to `('OWNER', 'PROVIDER', 'ADMIN')`

**After running:**
1. Create an admin user by updating an existing user's role:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```

2. Or set yourself as admin:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE id = 'your-user-id';
   ```

## Important Notes

- Always backup your database before running migrations
- Run migrations in order
- Test migrations on a development database first
- Check Prisma schema.prisma for the latest enum definitions

