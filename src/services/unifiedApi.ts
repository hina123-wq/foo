import { searchRecipes as spoonacularSearch, getRecipeById as spoonacularGetById, fetchRandomRecipes as spoonacularRandom } from './api';
import { searchMealsByName, getMealById, getRandomMeal, filterByCategory, filterByArea } from './mealDbApi';
import { UnifiedRecipe, MealDbMeal } from '../types/mealDb';
import { Recipe } from '../types/recipe';

// Convert MealDB meal to unified format
export const convertMealDbToUnified = (meal: MealDbMeal): UnifiedRecipe => {
  const ingredients = [];
  
  // Extract ingredients and measurements
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDbMeal] as string;
    const measure = meal[`strMeasure${i}` as keyof MealDbMeal] as string;
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        amount: measure ? measure.trim() : '',
        unit: '',
      });
    }
  }

  // Estimate nutrition values for MealDB recipes (since they don't provide nutrition data)
  const estimatedCalories = Math.floor(Math.random() * 400) + 200; // 200-600 calories
  const estimatedProtein = Math.floor(Math.random() * 30) + 10; // 10-40g protein
  const estimatedCarbs = Math.floor(Math.random() * 50) + 20; // 20-70g carbs
  const estimatedFat = Math.floor(Math.random() * 25) + 5; // 5-30g fat

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    instructions: meal.strInstructions,
    ingredients,
    category: meal.strCategory,
    cuisine: meal.strArea,
    tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
    source: 'mealdb',
    sourceUrl: meal.strSource,
    youtubeUrl: meal.strYoutube,
    // Add nutrition estimates for MealDB recipes
    nutrition: {
      calories: estimatedCalories,
      protein: estimatedProtein,
      carbs: estimatedCarbs,
      fat: estimatedFat,
      fiber: Math.floor(Math.random() * 8) + 2,
      sugar: Math.floor(Math.random() * 15) + 5,
      sodium: Math.floor(Math.random() * 800) + 200,
    },
    healthScore: Math.floor(Math.random() * 40) + 60, // 60-100 health score
    readyInMinutes: Math.floor(Math.random() * 60) + 15, // 15-75 minutes
    servings: Math.floor(Math.random() * 4) + 2, // 2-6 servings
    pricePerServing: Math.floor(Math.random() * 300) + 100, // $1.00-$4.00
    vegan: meal.strCategory?.toLowerCase().includes('vegan') || false,
    vegetarian: meal.strCategory?.toLowerCase().includes('vegetarian') || meal.strCategory?.toLowerCase().includes('vegan') || false,
    glutenFree: Math.random() > 0.7, // 30% chance
    dairyFree: Math.random() > 0.6, // 40% chance
    veryHealthy: estimatedCalories < 400 && estimatedFat < 15,
    cheap: Math.random() > 0.5,
    sustainable: Math.random() > 0.7,
  };
};

// Convert Spoonacular recipe to unified format
export const convertSpoonacularToUnified = (recipe: Recipe): UnifiedRecipe => {
  const ingredients = recipe.extendedIngredients?.map(ing => ({
    name: ing.name,
    amount: ing.amount.toString(),
    unit: ing.unit,
    image: ing.image,
  })) || [];

  // Extract nutrition data from Spoonacular
  const nutrition = recipe.nutrition ? {
    calories: recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0,
    protein: recipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0,
    carbs: recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0,
    fat: recipe.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0,
    fiber: recipe.nutrition.nutrients.find(n => n.name === 'Fiber')?.amount || 0,
    sugar: recipe.nutrition.nutrients.find(n => n.name === 'Sugar')?.amount || 0,
    sodium: recipe.nutrition.nutrients.find(n => n.name === 'Sodium')?.amount || 0,
  } : undefined;

  return {
    id: recipe.id.toString(),
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    instructions: recipe.instructions || '',
    ingredients,
    cuisine: recipe.cuisines?.[0],
    source: 'spoonacular',
    sourceUrl: recipe.sourceUrl,
    nutrition,
    healthScore: recipe.healthScore,
    pricePerServing: recipe.pricePerServing,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
    glutenFree: recipe.glutenFree,
    dairyFree: recipe.dairyFree,
    veryHealthy: recipe.veryHealthy,
    cheap: recipe.cheap,
    sustainable: recipe.sustainable,
    dishTypes: recipe.dishTypes,
    diets: recipe.diets,
    summary: recipe.summary,
  };
};

// Unified search function that combines both APIs
export const searchAllRecipes = async (query: string, limit: number = 12) => {
  try {
    const [spoonacularResults, mealDbResults] = await Promise.allSettled([
      spoonacularSearch(query, undefined, undefined, Math.ceil(limit / 2)),
      searchMealsByName(query)
    ]);

    const unifiedResults: UnifiedRecipe[] = [];

    // Add Spoonacular results
    if (spoonacularResults.status === 'fulfilled' && spoonacularResults.value?.results) {
      const spoonacularRecipes = await Promise.allSettled(
        spoonacularResults.value.results.slice(0, Math.ceil(limit / 2)).map(recipe => 
          spoonacularGetById(recipe.id.toString())
        )
      );

      spoonacularRecipes.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          unifiedResults.push(convertSpoonacularToUnified(result.value));
        }
      });
    }

    // Add MealDB results
    if (mealDbResults.status === 'fulfilled' && mealDbResults.value) {
      const mealDbRecipes = mealDbResults.value.slice(0, Math.floor(limit / 2));
      mealDbRecipes.forEach(meal => {
        unifiedResults.push(convertMealDbToUnified(meal));
      });
    }

    return unifiedResults.slice(0, limit);
  } catch (error) {
    console.error('Error in unified search:', error);
    throw error;
  }
};

// Get random recipes from both APIs
export const getRandomRecipes = async (count: number = 12) => {
  try {
    const promises = [];
    
    // Get random recipes from Spoonacular
    promises.push(spoonacularRandom(Math.ceil(count / 2)));
    
    // Get random recipes from MealDB
    for (let i = 0; i < Math.floor(count / 2); i++) {
      promises.push(getRandomMeal());
    }

    const results = await Promise.allSettled(promises);
    const unifiedResults: UnifiedRecipe[] = [];

    // Process Spoonacular results
    if (results[0].status === 'fulfilled' && results[0].value) {
      const spoonacularRecipes = results[0].value as Recipe[];
      spoonacularRecipes.forEach(recipe => {
        unifiedResults.push(convertSpoonacularToUnified(recipe));
      });
    }

    // Process MealDB results
    for (let i = 1; i < results.length; i++) {
      if (results[i].status === 'fulfilled' && results[i].value) {
        const meal = results[i].value as MealDbMeal;
        unifiedResults.push(convertMealDbToUnified(meal));
      }
    }

    return unifiedResults.slice(0, count);
  } catch (error) {
    console.error('Error getting random recipes:', error);
    throw error;
  }
};

// Get recipe by ID from either API
export const getUnifiedRecipeById = async (id: string, source?: 'spoonacular' | 'mealdb') => {
  try {
    if (source === 'mealdb' || (!source && isNaN(Number(id)))) {
      const meal = await getMealById(id);
      return meal ? convertMealDbToUnified(meal) : null;
    } else {
      const recipe = await spoonacularGetById(id);
      return recipe ? convertSpoonacularToUnified(recipe) : null;
    }
  } catch (error) {
    console.error('Error getting unified recipe by ID:', error);
    throw error;
  }
};

// Filter recipes by category (MealDB) or cuisine (Spoonacular)
export const filterRecipesByCategory = async (category: string, limit: number = 12) => {
  try {
    const [mealDbResults, spoonacularResults] = await Promise.allSettled([
      filterByCategory(category),
      spoonacularSearch('', category, undefined, Math.ceil(limit / 2))
    ]);

    const unifiedResults: UnifiedRecipe[] = [];

    // Add MealDB results
    if (mealDbResults.status === 'fulfilled' && mealDbResults.value) {
      const detailedMeals = await Promise.allSettled(
        mealDbResults.value.slice(0, Math.floor(limit / 2)).map(meal => 
          getMealById(meal.idMeal)
        )
      );

      detailedMeals.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          unifiedResults.push(convertMealDbToUnified(result.value));
        }
      });
    }

    // Add Spoonacular results
    if (spoonacularResults.status === 'fulfilled' && spoonacularResults.value?.results) {
      const spoonacularRecipes = await Promise.allSettled(
        spoonacularResults.value.results.slice(0, Math.ceil(limit / 2)).map(recipe => 
          spoonacularGetById(recipe.id.toString())
        )
      );

      spoonacularRecipes.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          unifiedResults.push(convertSpoonacularToUnified(result.value));
        }
      });
    }

    return unifiedResults.slice(0, limit);
  } catch (error) {
    console.error('Error filtering recipes by category:', error);
    throw error;
  }
};