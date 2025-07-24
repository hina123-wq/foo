// Tracking System Types

export interface UserGoals {
  id: string;
  user_id: string;
  daily_calorie_target: number;
  water_target_ml: number;
  preferred_diet_type?: string;
  protein_target_g: number;
  carbs_target_g: number;
  fat_target_g: number;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  water_intake_ml: number;
  created_at: string;
  updated_at: string;
}

export interface MealEntry {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id: string;
  recipe_title: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  created_at: string;
}

export interface MealSchedule {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id: string;
  recipe_title: string;
  recipe_image?: string;
  servings: number;
  calories?: number;
  created_at: string;
}

export interface RecipeRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  is_favorite: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  items?: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  ingredient_name: string;
  quantity?: string;
  category: string;
  is_checked: boolean;
  recipe_id?: string;
  recipe_title?: string;
  created_at: string;
}

export interface PantryItem {
  id: string;
  user_id: string;
  ingredient_name: string;
  quantity?: string;
  expiry_date?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  date: string;
  amount_ml: number;
  logged_at: string;
}

// Dashboard Data Types
export interface DashboardData {
  dailyLog: DailyLog | null;
  userGoals: UserGoals | null;
  todaysMeals: MealEntry[];
  recentWeight: WeightLog[];
  waterLogs: WaterLog[];
}

export interface MacronutrientData {
  protein: number;
  carbs: number;
  fat: number;
}

export interface CalorieProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface WaterProgress {
  current: number;
  target: number;
  percentage: number;
  glasses: number; // Assuming 250ml per glass
}