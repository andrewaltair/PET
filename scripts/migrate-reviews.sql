-- Migration script for Reviews and Ratings system (Phase 6)
-- Run this script to add review functionality to existing database

-- Add average_rating column to services table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'services'
                   AND column_name = 'average_rating') THEN
        ALTER TABLE services ADD COLUMN average_rating FLOAT DEFAULT 0;
    END IF;
END $$;

-- Add overall_average_rating column to profiles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'profiles'
                   AND column_name = 'overall_average_rating') THEN
        ALTER TABLE profiles ADD COLUMN overall_average_rating FLOAT DEFAULT 0;
    END IF;
END $$;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensure only OWNER can create reviews
    CONSTRAINT chk_owner_role CHECK (
        EXISTS (SELECT 1 FROM users WHERE id = owner_id AND role = 'OWNER')
    ),
    -- Ensure only COMPLETED bookings can be reviewed
    CONSTRAINT chk_completed_booking CHECK (
        EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND status = 'COMPLETED')
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_owner_id ON reviews(owner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Add updated_at trigger for reviews table (if not exists)
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
-- Note: reviews table doesn't have updated_at field, so no trigger needed

-- Create a function to recalculate service average rating
CREATE OR REPLACE FUNCTION recalculate_service_rating(service_uuid UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating FLOAT;
BEGIN
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating
    FROM reviews
    WHERE service_id = service_uuid;

    UPDATE services
    SET average_rating = avg_rating
    WHERE id = service_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create a function to recalculate provider overall average rating
CREATE OR REPLACE FUNCTION recalculate_provider_rating(provider_uuid UUID)
RETURNS VOID AS $$
DECLARE
    avg_rating FLOAT;
BEGIN
    -- Calculate average rating across all services for this provider
    SELECT COALESCE(AVG(s.average_rating), 0) INTO avg_rating
    FROM services s
    WHERE s.provider_id = provider_uuid;

    UPDATE profiles
    SET overall_average_rating = avg_rating
    WHERE user_id = provider_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically recalculate ratings when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION review_change_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate service rating
    PERFORM recalculate_service_rating(NEW.service_id);

    -- Recalculate provider rating
    PERFORM recalculate_provider_rating(NEW.provider_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE on reviews
DROP TRIGGER IF EXISTS review_insert_update_trigger ON reviews;
CREATE TRIGGER review_insert_update_trigger
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION review_change_trigger();

-- Create trigger for DELETE on reviews (to handle rating recalculation when reviews are deleted)
CREATE OR REPLACE FUNCTION review_delete_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate service rating
    PERFORM recalculate_service_rating(OLD.service_id);

    -- Recalculate provider rating
    PERFORM recalculate_provider_rating(OLD.provider_id);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS review_delete_trigger ON reviews;
CREATE TRIGGER review_delete_trigger
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION review_delete_trigger();

-- Optional: Add some sample data for testing (uncomment if needed)
-- INSERT INTO reviews (booking_id, service_id, owner_id, provider_id, rating, comment)
-- SELECT
--     b.id as booking_id,
--     b.service_id,
--     b.owner_id,
--     b.service_id as provider_id, -- This should be the provider from the service
--     (random() * 4 + 1)::int as rating,
--     'Great service!' as comment
-- FROM bookings b
-- WHERE b.status = 'COMPLETED'
-- LIMIT 5;

COMMIT;
