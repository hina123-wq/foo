const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// TheMealDB API service functions
export const searchMealsByName = async (name: string) => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals by name:', error);
    throw error;
  }
};

export const searchMealsByFirstLetter = async (letter: string) => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals by first letter:', error);
    throw error;
  }
};

export const getMealById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    throw error;
  }
};

export const getRandomMeal = async () => {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching random meal:', error);
    throw error;
  }
};

export const getMealCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching meal categories:', error);
    throw error;
  }
};

export const getAreas = async () => {
  try {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

export const getIngredients = async () => {
  try {
    const response = await fetch(`${BASE_URL}/list.php?i=list`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

export const filterByIngredient = async (ingredient: string) => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error filtering by ingredient:', error);
    throw error;
  }
};

export const filterByCategory = async (category: string) => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error filtering by category:', error);
    throw error;
  }
};

export const filterByArea = async (area: string) => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error filtering by area:', error);
    throw error;
  }
};

// Helper function to get ingredient image URL
export const getIngredientImageUrl = (ingredient: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const formattedIngredient = ingredient.toLowerCase().replace(/\s+/g, '_');
  const sizeParam = size === 'medium' ? '' : `-${size}`;
  return `https://www.themealdb.com/images/ingredients/${formattedIngredient}${sizeParam}.png`;
};

// Helper function to get meal thumbnail URL
export const getMealThumbnailUrl = (imageUrl: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  if (!imageUrl) return '';
  const baseUrl = imageUrl.replace('/preview', '');
  return `${baseUrl}/${size}`;
};