-- Create test users with proper hashed passwords
-- Password for all users: password123

INSERT INTO users (id, email, password, role, created_at, updated_at) VALUES
('test-owner-1', 'owner@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LEtHvJUzLkMqQcUe', 'OWNER', NOW(), NOW()),
('test-owner-2', 'testowner@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LEtHvJUzLkMqQcUe', 'OWNER', NOW(), NOW()),
('test-provider-1', 'provider@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LEtHvJUzLkMqQcUe', 'PROVIDER', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  updated_at = NOW();
