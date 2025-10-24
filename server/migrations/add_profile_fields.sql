-- Migration: Add new profile fields
-- Date: 2025-01-XX
-- Description: Add social media links, phone, address, animal types, and services provided fields to profiles table

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS address VARCHAR(200) NULL AFTER location,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL AFTER address,
ADD COLUMN IF NOT EXISTS tiktok_url TEXT NULL AFTER instagram_url,
ADD COLUMN IF NOT EXISTS telegram_url TEXT NULL AFTER tiktok_url,
ADD COLUMN IF NOT EXISTS whatsapp_url TEXT NULL AFTER telegram_url,
ADD COLUMN IF NOT EXISTS viber_url TEXT NULL AFTER whatsapp_url,
ADD COLUMN IF NOT EXISTS animal_types ENUM('DOGS_ONLY', 'ALL_ANIMALS') NULL AFTER viber_url,
ADD COLUMN IF NOT EXISTS services_provided LONGTEXT NULL AFTER animal_types;

-- Remove Twitter and LinkedIn columns if they exist
ALTER TABLE profiles DROP COLUMN IF EXISTS twitter_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS linkedin_url;

-- Note: The services_provided field will store JSON array of service types
-- Example: ["WALKING", "SITTING", "GROOMING"]


