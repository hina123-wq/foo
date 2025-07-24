import axios from 'axios';

const API_KEY = '14daf2a1858b42ef91d09f985b53fd8f';
const BASE_URL = 'https://api.spoonacular.com';

// Create an axios instance with predefined configuration
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

export const fetchRandomRecipes = async (number = 12) => {
  try {
    const response = await api.get('/recipes/random', {
      params: { number },
    });
    return response.data.recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

export const searchRecipes = async (query: string, cuisine?: string, diet?: string, number = 12) => {
  try {
    const params: any = { query, number };
    if (cuisine) params.cuisine = cuisine;
    if (diet) params.diet = diet;

    const response = await api.get('/recipes/complexSearch', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

export const getRecipeById = async (id: string) => {
  try {
    const response = await api.get(`/recipes/${id}/information`, {
      params: {
        includeNutrition: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe with id ${id}:`, error);
    throw error;
  }
};

export const getRecipeInstructions = async (id: string) => {
  try {
    const response = await api.get(`/recipes/${id}/analyzedInstructions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching instructions for recipe ${id}:`, error);
    throw error;
  }
};

export const getCuisines = async () => {
  try {
    // This is a workaround since Spoonacular doesn't have a direct endpoint for cuisines
    // We'll use a predefined list of common cuisines
    return [
      'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European',
      'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese',
      'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern',
      'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
    ];
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    throw error;
  }
};

export const getNutritionForIngredient = async (ingredient: string) => {
  try {
    const response = await api.get('/food/ingredients/search', {
      params: { query: ingredient, number: 1 },
    });
    
    if (response.data.results && response.data.results.length > 0) {
      const id = response.data.results[0].id;
      const nutritionResponse = await api.get(`/food/ingredients/${id}/information`, {
        params: { amount: 1, unit: 'serving' },
      });
      return nutritionResponse.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching nutrition for ${ingredient}:`, error);
    throw error;
  }
};

export const getMealPlanForDay = async (calories: number, diet?: string, exclude?: string) => {
  try {
    const params: any = { 
      targetCalories: calories,
      timeFrame: 'day'
    };
    
    if (diet) params.diet = diet;
    if (exclude) params.exclude = exclude;
    
    const response = await api.get('/mealplanner/generate', { params });
    return response.data;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

export default api;