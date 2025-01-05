
CREATE TABLE meal_plan (
    user_id "uuid" NOT NULL,
    recipe_id bigint NOT NULL,
    plan_date DATE NOT NULL,
    meal_type VARCHAR(10) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_meal_plan_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_meal_plan_recipe FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_meal_plan_user ON meal_plan(user_id);
CREATE INDEX idx_meal_plan_recipe ON meal_plan(recipe_id);