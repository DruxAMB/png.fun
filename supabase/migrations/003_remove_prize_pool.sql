-- Remove prize_pool column from challenges table
-- Prize pool is now calculated dynamically from total WLD voted

ALTER TABLE challenges DROP COLUMN IF EXISTS prize_pool;
