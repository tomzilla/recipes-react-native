ALTER TABLE amazon_product_link DROP COLUMN asin;
ALTER TABLE amazon_product_link ADD COLUMN asin varchar null;