/*
  # Food App Tracking System Database Schema

  1. New Tables
    - `user_goals` - Store user's daily targets and preferences
    - `daily_logs` - Track daily nutrition and water intake
    - `meal_entries` - Log individual meals with nutrition data
    - `weight_logs` - Track user weight over time
    - `meal_schedules` - Schedule meals for upcoming days
    - `recipe_ratings` - User ratings and favorites for recipes
    - `shopping_lists` - Generated shopping lists from meal plans
    - `pantry_items` - User's available ingredients

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_calorie_target integer DEFAULT 2000,
  water_target_ml integer DEFAULT 2000,
  preferred_diet_type text,
  protein_target_g integer DEFAULT 150,
  carbs_target_g integer DEFAULT 250,
  fat_target_g integer DEFAULT 65,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Daily Logs Table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  total_calories integer DEFAULT 0,
  total_protein integer DEFAULT 0,
  total_carbs integer DEFAULT 0,
  total_fat integer DEFAULT 0,
  water_intake_ml integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Meal Entries Table
CREATE TABLE IF NOT EXISTS meal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id text NOT NULL,
  recipe_title text NOT NULL,
  quantity real DEFAULT 1,
  calories integer NOT NULL,
  protein integer DEFAULT 0,
  carbs integer DEFAULT 0,
  fat integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Weight Logs Table
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  weight_kg real NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Meal Schedules Table
CREATE TABLE IF NOT EXISTS meal_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id text NOT NULL,
  recipe_title text NOT NULL,
  recipe_image text,
  servings integer DEFAULT 1,
  calories integer,
  created_at timestamptz DEFAULT now()
);

-- Recipe Ratings Table
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_favorite boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Shopping Lists Table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Shopping List',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shopping List Items Table
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id uuid REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  quantity text,
  category text DEFAULT 'other',
  is_checked boolean DEFAULT false,
  recipe_id text,
  recipe_title text,
  created_at timestamptz DEFAULT now()
);

-- Pantry Items Table
CREATE TABLE IF NOT EXISTS pantry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  quantity text,
  expiry_date date,
  category text DEFAULT 'other',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Water Intake Logs Table
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  amount_ml integer NOT NULL,
  logged_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_goals
CREATE POLICY "Users can manage their own goals"
  ON user_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_logs
CREATE POLICY "Users can manage their own daily logs"
  ON daily_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for meal_entries
CREATE POLICY "Users can manage their own meal entries"
  ON meal_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for weight_logs
CREATE POLICY "Users can manage their own weight logs"
  ON weight_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for meal_schedules
CREATE POLICY "Users can manage their own meal schedules"
  ON meal_schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for recipe_ratings
CREATE POLICY "Users can manage their own recipe ratings"
  ON recipe_ratings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shopping_lists
CREATE POLICY "Users can manage their own shopping lists"
  ON shopping_lists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shopping_list_items
CREATE POLICY "Users can manage their own shopping list items"
  ON shopping_list_items
  FOR ALL
  TO authenticated
  USING (
    shopping_list_id IN (
      SELECT id FROM shopping_lists WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for pantry_items
CREATE POLICY "Users can manage their own pantry items"
  ON pantry_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for water_logs
CREATE POLICY "Users can manage their own water logs"
  ON water_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions to update daily_logs automatically
CREATE OR REPLACE FUNCTION update_daily_logs()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily log entry
  INSERT INTO daily_logs (user_id, date, total_calories, total_protein, total_carbs, total_fat)
  VALUES (
    NEW.user_id,
    NEW.date,
    NEW.calories,
    NEW.protein,
    NEW.carbs,
    NEW.fat
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_calories = daily_logs.total_calories + NEW.calories,
    total_protein = daily_logs.total_protein + NEW.protein,
    total_carbs = daily_logs.total_carbs + NEW.carbs,
    total_fat = daily_logs.total_fat + NEW.fat,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update daily logs when meal entries are added
CREATE TRIGGER update_daily_logs_trigger
  AFTER INSERT ON meal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_logs();

-- Function to update water intake in daily_logs
CREATE OR REPLACE FUNCTION update_water_intake()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily log with water intake
  INSERT INTO daily_logs (user_id, date, water_intake_ml)
  VALUES (NEW.user_id, NEW.date, NEW.amount_ml)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    water_intake_ml = daily_logs.water_intake_ml + NEW.amount_ml,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for water intake
CREATE TRIGGER update_water_intake_trigger
  AFTER INSERT ON water_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_water_intake();