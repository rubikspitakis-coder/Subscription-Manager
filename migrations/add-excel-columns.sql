-- Add new columns from Excel to subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS pros text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cons text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS usage_description text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS related_projects text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS official_website text;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS recommendation_score integer;
