import { supabase } from '../lib/supabase';
import {
  UserGoals,
  DailyLog,
  MealEntry,
  WeightLog,
  MealSchedule,
  RecipeRating,
  ShoppingList,
  ShoppingListItem,
  PantryItem,
  WaterLog,
  DashboardData
} from '../types/tracking';

// User Goals API
export const getUserGoals = async (): Promise<UserGoals | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const upsertUserGoals = async (goals: Partial<UserGoals>): Promise<UserGoals> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_goals')
    .upsert({
      user_id: user.id,
      ...goals,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Daily Logs API
export const getDailyLog = async (date: string): Promise<DailyLog | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getDailyLogs = async (startDate: string, endDate: string): Promise<DailyLog[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Meal Entries API
export const addMealEntry = async (mealEntry: Omit<MealEntry, 'id' | 'user_id' | 'created_at'>): Promise<MealEntry> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meal_entries')
    .insert({
      user_id: user.id,
      ...mealEntry
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMealEntries = async (date: string): Promise<MealEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const deleteMealEntry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meal_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Weight Logs API
export const addWeightLog = async (weight: number, date?: string): Promise<WeightLog> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('weight_logs')
    .upsert({
      user_id: user.id,
      weight_kg: weight,
      date: date || new Date().toISOString().split('T')[0]
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWeightLogs = async (limit: number = 30): Promise<WeightLog[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// Water Logs API
export const addWaterLog = async (amount_ml: number): Promise<WaterLog> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: user.id,
      amount_ml,
      date: new Date().toISOString().split('T')[0]
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWaterLogs = async (date: string): Promise<WaterLog[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .order('logged_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Meal Schedules API
export const addMealSchedule = async (schedule: Omit<MealSchedule, 'id' | 'user_id' | 'created_at'>): Promise<MealSchedule> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meal_schedules')
    .insert({
      user_id: user.id,
      ...schedule
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMealSchedules = async (startDate: string, endDate: string): Promise<MealSchedule[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('meal_schedules')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const deleteMealSchedule = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meal_schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Recipe Ratings API
export const rateRecipe = async (recipeId: string, rating: number, isFavorite: boolean, notes?: string): Promise<RecipeRating> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('recipe_ratings')
    .upsert({
      user_id: user.id,
      recipe_id: recipeId,
      rating,
      is_favorite: isFavorite,
      notes,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRecipeRating = async (recipeId: string): Promise<RecipeRating | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getFavoriteRecipes = async (): Promise<RecipeRating[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Dashboard Data API
export const getDashboardData = async (): Promise<DashboardData> => {
  const today = new Date().toISOString().split('T')[0];
  
  const [
    userGoals,
    dailyLog,
    todaysMeals,
    recentWeight,
    waterLogs
  ] = await Promise.all([
    getUserGoals(),
    getDailyLog(today),
    getMealEntries(today),
    getWeightLogs(7),
    getWaterLogs(today)
  ]);

  return {
    userGoals,
    dailyLog,
    todaysMeals,
    recentWeight,
    waterLogs
  };
};

// Shopping List API
export const createShoppingList = async (name: string): Promise<ShoppingList> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({
      user_id: user.id,
      name
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const generateShoppingListFromMeals = async (startDate: string, endDate: string): Promise<ShoppingList> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get scheduled meals
  const meals = await getMealSchedules(startDate, endDate);
  
  // Create shopping list
  const shoppingList = await createShoppingList(`Meal Plan ${startDate} to ${endDate}`);
  
  // Group ingredients by recipe and add to shopping list
  const ingredientMap = new Map<string, { quantity: string; category: string; recipes: string[] }>();
  
  for (const meal of meals) {
    // This would need to fetch recipe details to get ingredients
    // For now, we'll create a placeholder implementation
    const ingredients = [`Ingredient for ${meal.recipe_title}`];
    
    ingredients.forEach(ingredient => {
      if (ingredientMap.has(ingredient)) {
        const existing = ingredientMap.get(ingredient)!;
        existing.recipes.push(meal.recipe_title);
      } else {
        ingredientMap.set(ingredient, {
          quantity: '1 serving',
          category: 'other',
          recipes: [meal.recipe_title]
        });
      }
    });
  }
  
  // Add items to shopping list
  const items = Array.from(ingredientMap.entries()).map(([ingredient, data]) => ({
    shopping_list_id: shoppingList.id,
    ingredient_name: ingredient,
    quantity: data.quantity,
    category: data.category,
    recipe_title: data.recipes.join(', ')
  }));
  
  if (items.length > 0) {
    const { error } = await supabase
      .from('shopping_list_items')
      .insert(items);
    
    if (error) throw error;
  }
  
  return shoppingList;
};