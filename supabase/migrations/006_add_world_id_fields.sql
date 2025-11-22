-- Add World ID specific fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS world_id_nullifier TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_level TEXT;

-- Add unique constraint to nullifier to prevent one person verifying multiple accounts
-- We use a partial index to allow multiple NULLs (unverified users) but enforce uniqueness for verified ones
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_world_id_nullifier ON users(world_id_nullifier) WHERE world_id_nullifier IS NOT NULL;
