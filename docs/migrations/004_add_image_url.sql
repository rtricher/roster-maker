-- Add image_url column to units table
ALTER TABLE units ADD COLUMN IF NOT EXISTS image_url TEXT;
