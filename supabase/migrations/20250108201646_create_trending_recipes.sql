
CREATE TABLE trending_recipes (
    id SERIAL PRIMARY KEY,
    recipe_id bigint NOT NULL,
    -- Foreign keys
    CONSTRAINT fk_trending_recipes_recipe FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_trending_recipes_recipe ON meal_plan(recipe_id);

