-- Migration: Add ADMIN role to UserRole enum
-- Date: 2025-01-23
-- Description: Adds ADMIN role to the UserRole enum in the users table
-- Database: MySQL
-- Table: users
-- Column: role

-- Step 1: Check current enum values
-- SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role';

-- Step 2: Modify the column to include ADMIN role
ALTER TABLE users MODIFY COLUMN role ENUM('OWNER', 'PROVIDER', 'ADMIN') NOT NULL;

-- Step 3: Verify the change
-- SELECT DISTINCT role FROM users;

-- Step 4: Optional - Set one user as ADMIN (replace 'user-id-here' with actual user ID)
-- UPDATE users SET role = 'ADMIN' WHERE id = 'user-id-here';
