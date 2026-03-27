SELECT 'media_items' AS table_name, COUNT(*) AS total FROM media_items
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'rate_limit_events', COUNT(*) FROM rate_limit_events
UNION ALL
SELECT 'quote_attachments', COUNT(*) FROM quote_attachments;
