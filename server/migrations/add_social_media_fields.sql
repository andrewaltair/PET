-- Migration: Add social media fields to profiles table
-- Date: 2025-01-23

ALTER TABLE profiles 
ADD COLUMN facebook_url VARCHAR(255) NULL AFTER location,
ADD COLUMN instagram_url VARCHAR(255) NULL AFTER facebook_url,
ADD COLUMN twitter_url VARCHAR(255) NULL AFTER instagram_url,
ADD COLUMN linkedin_url VARCHAR(255) NULL AFTER twitter_url;

