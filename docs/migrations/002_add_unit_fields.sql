-- Add stat columns to units table for full unit data storage
-- (Users enter their own data — no copyrighted content is stored by the app)

ALTER TABLE units ADD COLUMN IF NOT EXISTS movement VARCHAR(50);
ALTER TABLE units ADD COLUMN IF NOT EXISTS toughness INTEGER;
ALTER TABLE units ADD COLUMN IF NOT EXISTS save VARCHAR(10);
ALTER TABLE units ADD COLUMN IF NOT EXISTS wounds INTEGER DEFAULT 1;
ALTER TABLE units ADD COLUMN IF NOT EXISTS leadership INTEGER;
ALTER TABLE units ADD COLUMN IF NOT EXISTS objective_control INTEGER;
ALTER TABLE units ADD COLUMN IF NOT EXISTS abilities JSONB DEFAULT '[]';
ALTER TABLE units ADD COLUMN IF NOT EXISTS weapons JSONB DEFAULT '[]';

-- Add detachment and max_points to rosters
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS detachment VARCHAR(255);
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS max_points INTEGER DEFAULT 2000;
