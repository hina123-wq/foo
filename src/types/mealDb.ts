// TheMealDB API Types
export interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

export interface MealDbCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealDbArea {
  strArea: string;
}

export interface MealDbIngredient {
  idIngredient: string;
  strIngredient: string;
  strDescription?: string;
  strType?: string;
}

// Enhanced unified recipe interface with comprehensive nutrition and health data
export interface UnifiedRecipe {
  id: string;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  instructions: string;
  ingredients: UnifiedIngredient[];
  category?: string;
  cuisine?: string;
  tags?: string[];
  source: 'spoonacular' | 'mealdb';
  sourceUrl?: string;
  youtubeUrl?: string;
  
  // Nutrition information
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  
  // Health and dietary information
  healthScore?: number;
  pricePerServing?: number;
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  veryHealthy?: boolean;
  cheap?: boolean;
  sustainable?: boolean;
  
  // Additional Spoonacular fields
  dishTypes?: string[];
  diets?: string[];
  summary?: string;
}

export interface UnifiedIngredient {
  name: string;
  amount?: string;
  unit?: string;
  image?: string;
}