-- Delete old services completely to keep only the 5 new ones in the Command Center
DELETE FROM services 
WHERE id NOT IN ('business_consulting', 'marketing_strategy', 'brand_identity', 'marketing_creative', 'web_mobile_dev');
