-- Pet Service Marketplace Database Schema
-- PostgreSQL 15+ compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('OWNER', 'PROVIDER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('WALKING', 'SITTING', 'GROOMING', 'VETERINARIAN_VISIT', 'TAXI', 'TRAINING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Profiles table (extends users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url TEXT,
    bio TEXT, -- Only for PROVIDER role
    location VARCHAR(100), -- Only for PROVIDER role
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type service_type NOT NULL,
    -- Legacy fields (for backward compatibility)
    title VARCHAR(200),
    description TEXT,
    -- Multilingual fields
    title_geo VARCHAR(100),
    title_eng VARCHAR(100),
    title_rus VARCHAR(100),
    description_geo TEXT,
    description_eng TEXT,
    description_rus TEXT,
    -- At least one language must be provided
    CONSTRAINT chk_language_check CHECK (
        (title_geo IS NOT NULL AND description_geo IS NOT NULL) OR
        (title_eng IS NOT NULL AND description_eng IS NOT NULL) OR
        (title_rus IS NOT NULL AND description_rus IS NOT NULL)
    ),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    availability JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"monday": ["09:00-18:00"], "tuesday": ["10:00-17:00"]}
    -- Images: main image + up to 10 sub images
    main_image_url TEXT,
    sub_images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs (max 10)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: only PROVIDER role can create services
    CONSTRAINT chk_provider_role CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = provider_id AND role = 'PROVIDER'
        )
    )
);

-- Create indexes for services table
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_service_type ON services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);

-- Full-text search index for services (search across all languages)
CREATE INDEX IF NOT EXISTS idx_services_search ON services USING gin(
    to_tsvector('english', 
        COALESCE(title_geo, '') || ' ' || 
        COALESCE(title_eng, '') || ' ' || 
        COALESCE(title_rus, '') || ' ' ||
        COALESCE(description_geo, '') || ' ' || 
        COALESCE(description_eng, '') || ' ' || 
        COALESCE(description_rus, '')
    )
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    booking_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: only OWNER role can create bookings
    CONSTRAINT chk_owner_role CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE id = owner_id AND role = 'OWNER'
        )
    )
);

-- Create indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_time ON bookings(booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_bookings_owner_status ON bookings(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_services_provider_type ON services(provider_id, service_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert concept/test data
-- Admin user (admin@example.com / admin)
INSERT INTO users (id, email, password_hash, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com', '$2b$12$QVBzQ85InhStf7mMpl/aSepARgkmOaqPDXoY.B9F5ejWb8HxbfHda', 'OWNER')
ON CONFLICT (email) DO NOTHING;

-- Regular user (user@example.com / user)
INSERT INTO users (id, email, password_hash, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'user@example.com', '$2b$12$3wR7QmRWCyiThEFSxofN8edq7CYwbr4iZjl6lqcX22a70.YqNjCI2', 'OWNER')
ON CONFLICT (email) DO NOTHING;

-- Provider user (provider@example.com / provider)
INSERT INTO users (id, email, password_hash, role) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'provider@example.com', '$2b$12$5vAC8e26wvWJcC7AQJkNRumWljAsEMhkoZCX2CgSUYYmUdC5HkNJG', 'PROVIDER')
ON CONFLICT (email) DO NOTHING;

-- Create profiles for test users
INSERT INTO profiles (user_id, first_name, last_name, avatar_url, bio, location) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'User', '/avatars/1a270860bac2c66b434968a3047822e3.webp', 'System Administrator', 'System'),
('550e8400-e29b-41d4-a716-446655440001', 'Regular', 'User', '/avatars/2b04cc0b930f82afe6c38d3209dcbdfd.webp', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440002', 'Pet', 'Provider', '/avatars/1c9a4dd0bbd964e3eecbd40caf3b7e37.webp', 'Professional pet care provider with 3 years of experience. Specializing in dog walking and pet sitting.', 'New York, NY')
ON CONFLICT (user_id) DO NOTHING;

-- Create sample services for the provider
INSERT INTO services (provider_id, service_type, title, description, price, availability) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'WALKING', 'Premium Dog Walking Service', 'Professional dog walking with 30-45 minute walks. Includes leash, waste bags, and treats. Available 7 days a week in Manhattan area.', 25.00, '{"monday": ["08:00-20:00"], "tuesday": ["08:00-20:00"], "wednesday": ["08:00-20:00"], "thursday": ["08:00-20:00"], "friday": ["08:00-20:00"], "saturday": ["09:00-18:00"], "sunday": ["10:00-17:00"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'SITTING', 'In-Home Pet Sitting', 'Full-service in-home pet sitting. Includes feeding, playtime, walks, and medication administration. Daily check-ins and photo updates included.', 45.00, '{"monday": ["07:00-22:00"], "tuesday": ["07:00-22:00"], "wednesday": ["07:00-22:00"], "thursday": ["07:00-22:00"], "friday": ["07:00-22:00"], "saturday": ["08:00-20:00"], "sunday": ["09:00-19:00"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'GROOMING', 'Mobile Grooming Service', 'Complete grooming service at your home. Includes bath, nail trim, ear cleaning, and brushing. All breeds welcome.', 60.00, '{"tuesday": ["10:00-16:00"], "wednesday": ["10:00-16:00"], "thursday": ["10:00-16:00"], "friday": ["10:00-16:00"], "saturday": ["09:00-15:00"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'TRAINING', 'Basic Obedience Training', '4-week obedience training program. Covers sit, stay, come, heel, and loose-leash walking. Includes follow-up sessions.', 150.00, '{"monday": ["18:00-20:00"], "wednesday": ["18:00-20:00"], "friday": ["18:00-20:00"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'TAXI', 'Pet Transportation', 'Safe and comfortable pet transportation. Includes pickup and delivery within 25-mile radius. Climate-controlled vehicle.', 35.00, '{"monday": ["09:00-18:00"], "tuesday": ["09:00-18:00"], "wednesday": ["09:00-18:00"], "thursday": ["09:00-18:00"], "friday": ["09:00-18:00"], "saturday": ["10:00-16:00"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'VETERINARIAN_VISIT', 'Mobile Vet Check-ups', 'Routine wellness exams and vaccinations at your home. Licensed veterinarian with mobile clinic.', 80.00, '{"wednesday": ["14:00-17:00"], "saturday": ["10:00-14:00"]}')
ON CONFLICT (id) DO NOTHING;

