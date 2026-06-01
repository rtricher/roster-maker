-- Game Systems: define stat templates for each game
CREATE TABLE IF NOT EXISTS game_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit_stat_template JSONB NOT NULL DEFAULT '[]',
  weapon_stat_template JSONB NOT NULL DEFAULT '[]',
  roles JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weapon Templates: reusable weapon library per user
CREATE TABLE IF NOT EXISTS weapon_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_system_id UUID REFERENCES game_systems(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ranged', 'melee')),
  stats JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add game_system_id and role to units and rosters
ALTER TABLE rosters ADD COLUMN IF NOT EXISTS game_system_id UUID REFERENCES game_systems(id) ON DELETE SET NULL;
ALTER TABLE units ADD COLUMN IF NOT EXISTS role TEXT;

-- RLS for weapon_templates
ALTER TABLE weapon_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weapon templates"
  ON weapon_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weapon templates"
  ON weapon_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weapon templates"
  ON weapon_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weapon templates"
  ON weapon_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Game systems are readable by everyone (system data)
ALTER TABLE game_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game systems"
  ON game_systems FOR SELECT
  USING (true);

-- Seed WH40K 10th Edition
INSERT INTO game_systems (name, unit_stat_template, weapon_stat_template, roles) VALUES (
  'Warhammer 40,000 (10th Edition)',
  '[{"key":"movement","label":"M","type":"text","default":"6\""},{"key":"toughness","label":"T","type":"number","default":4},{"key":"save","label":"SV","type":"text","default":"3+"},{"key":"wounds","label":"W","type":"number","default":1},{"key":"leadership","label":"LD","type":"number","default":6},{"key":"objectiveControl","label":"OC","type":"number","default":1}]',
  '[{"key":"range","label":"Range","type":"text"},{"key":"attacks","label":"A","type":"text"},{"key":"skill","label":"BS/WS","type":"text"},{"key":"strength","label":"S","type":"number"},{"key":"ap","label":"AP","type":"number"},{"key":"damage","label":"D","type":"text"}]',
  '[{"name":"Character","icon":"command"},{"name":"Battleline","icon":"troops"},{"name":"Infantry","icon":"troops"},{"name":"Mounted","icon":"fast"},{"name":"Vehicle","icon":"heavy"},{"name":"Monster","icon":"heavy"},{"name":"Fortification","icon":"heavy"},{"name":"Dedicated Transport","icon":"transport"}]'
);
