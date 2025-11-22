-- Add world_id_verified column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS world_id_verified BOOLEAN DEFAULT FALSE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_world_id_verified ON users(world_id_verified);
