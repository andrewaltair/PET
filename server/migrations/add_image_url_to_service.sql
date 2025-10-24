-- Add image_url column to services table
ALTER TABLE services ADD COLUMN image_url VARCHAR(255) NULL;

-- Update existing services with default images based on service type
UPDATE services SET image_url = '/images/dog-walking.svg' WHERE service_type = 'WALKING';
UPDATE services SET image_url = '/images/pet-sitting.svg' WHERE service_type = 'SITTING';
UPDATE services SET image_url = '/images/grooming.svg' WHERE service_type = 'GROOMING';
UPDATE services SET image_url = '/images/vet-visit.svg' WHERE service_type = 'VETERINARIAN_VISIT';
UPDATE services SET image_url = '/images/pet-taxi.svg' WHERE service_type = 'TAXI';
UPDATE services SET image_url = '/images/training.svg' WHERE service_type = 'TRAINING';

