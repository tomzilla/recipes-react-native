
CREATE TABLE amazon_product_link (
    id SERIAL PRIMARY KEY,
    product_name varchar NOT NULL,
    asin varchar NULL
    -- Foreign keys
);

-- Indexes
CREATE INDEX idx_amazon_product_name ON amazon_product_link(product_name);

