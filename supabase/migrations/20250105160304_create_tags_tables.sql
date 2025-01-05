CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to associate recipes with tags, and track the user who created the tag
CREATE TABLE recipe_tags (
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL,
    tag_id INT NOT NULL,
    user_id uuid,  -- NULL for global tags, user ID for user-created tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_recipe_tags_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe_tags_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Ensure no duplicate tags for the same recipe and user
    UNIQUE (recipe_id, tag_id, user_id)
);

-- Indexes for faster search
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_recipe_tags ON recipe_tags(recipe_id, tag_id, user_id);
CREATE INDEX idx_recipe_tags_tag_id_user_id ON recipe_tags(tag_id, user_id);
CREATE INDEX idx_recipe_tags_tag_id ON recipe_tags(tag_id);