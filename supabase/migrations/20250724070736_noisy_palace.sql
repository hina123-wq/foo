/*
  # Add daily reset functionality

  1. Functions
    - Create function to reset daily data at midnight
    - Create function to check if data is from current day
  
  2. Triggers
    - Add trigger to automatically reset data daily
  
  3. Notes
    - Data older than current day will be archived/reset
    - Ensures fresh start each day at midnight
*/

-- Function to check if a date is today
CREATE OR REPLACE FUNCTION is_today(check_date date)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN check_date = CURRENT_DATE;
END;
$$;

-- Function to reset daily data (called at midnight)
CREATE OR REPLACE FUNCTION reset_daily_data()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Reset daily logs that are not from today
  UPDATE daily_logs 
  SET 
    total_calories = 0,
    total_protein = 0,
    total_carbs = 0,
    total_fat = 0,
    water_intake_ml = 0,
    updated_at = now()
  WHERE date < CURRENT_DATE;
  
  -- Archive old meal entries (optional - you might want to keep history)
  -- For now, we'll keep meal entries for history but they won't affect current day calculations
  
  -- Archive old water logs (optional - you might want to keep history)
  -- For now, we'll keep water logs for history
  
  -- Log the reset operation
  INSERT INTO daily_logs (user_id, date, total_calories, total_protein, total_carbs, total_fat, water_intake_ml)
  SELECT DISTINCT user_id, CURRENT_DATE, 0, 0, 0, 0, 0
  FROM user_goals
  WHERE NOT EXISTS (
    SELECT 1 FROM daily_logs 
    WHERE daily_logs.user_id = user_goals.user_id 
    AND daily_logs.date = CURRENT_DATE
  );
END;
$$;

-- Create a function that ensures daily logs exist for current date
CREATE OR REPLACE FUNCTION ensure_daily_log()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure daily log exists for current date
  INSERT INTO daily_logs (user_id, date, total_calories, total_protein, total_carbs, total_fat, water_intake_ml)
  VALUES (NEW.user_id, CURRENT_DATE, 0, 0, 0, 0, 0)
  ON CONFLICT (user_id, date) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to ensure daily log exists when user goals are created/updated
CREATE OR REPLACE TRIGGER ensure_daily_log_on_goals
  AFTER INSERT OR UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION ensure_daily_log();

-- Update the existing triggers to only update current day's data
CREATE OR REPLACE FUNCTION update_daily_logs()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update if the meal entry is for today
  IF NEW.date = CURRENT_DATE THEN
    INSERT INTO daily_logs (user_id, date, total_calories, total_protein, total_carbs, total_fat)
    VALUES (NEW.user_id, NEW.date, NEW.calories, NEW.protein, NEW.carbs, NEW.fat)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
      total_calories = daily_logs.total_calories + NEW.calories,
      total_protein = daily_logs.total_protein + NEW.protein,
      total_carbs = daily_logs.total_carbs + NEW.carbs,
      total_fat = daily_logs.total_fat + NEW.fat,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_water_intake()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update if the water log is for today
  IF NEW.date = CURRENT_DATE THEN
    INSERT INTO daily_logs (user_id, date, water_intake_ml)
    VALUES (NEW.user_id, NEW.date, NEW.amount_ml)
    ON CONFLICT (user_id, date)
    DO UPDATE SET
      water_intake_ml = daily_logs.water_intake_ml + NEW.amount_ml,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Note: In a production environment, you would set up a cron job or scheduled task
-- to call reset_daily_data() at midnight each day. For now, the application will
-- handle this by checking dates and ensuring fresh data for each day.