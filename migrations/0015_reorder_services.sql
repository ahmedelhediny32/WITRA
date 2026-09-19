-- Make Business Consulting appear first by setting its created_at to an older date
UPDATE services SET created_at = '2000-01-01 00:00:00' WHERE id = 'business_consulting';
