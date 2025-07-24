export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  license: string;
  sourceName: string;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  analyzedInstructions: AnalyzedInstruction[];
  cheap: boolean;
  creditsText: string;
  cuisines: string[];
  dairyFree: boolean;
  diets: string[];
  gaps: string;
  glutenFree: boolean;
  instructions: string;
  ketogenic: boolean;
  lowFodmap: boolean;
  occasions: string[];
  sustainable: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  whole30: boolean;
  weightWatcherSmartPoints: number;
  dishTypes: string[];
  extendedIngredients: ExtendedIngredient[];
  summary: string;
  nutrition?: Nutrition;
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients: Ingredient[];
  equipment: Equipment[];
  length?: {
    number: number;
    unit: string;
  };
}

export interface Ingredient {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

export interface Equipment {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

export interface ExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  };
}

export interface Nutrition {
  nutrients: Nutrient[];
  properties: Property[];
  flavonoids: Flavonoid[];
  ingredients: IngredientNutrition[];
  caloricBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightPerServing: {
    amount: number;
    unit: string;
  };
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface Property {
  name: string;
  amount: number;
  unit: string;
}

export interface Flavonoid {
  name: string;
  amount: number;
  unit: string;
}

export interface IngredientNutrition {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: Nutrient[];
}

export interface RecipeSearchResponse {
  results: RecipeSearchResult[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface RecipeSearchResult {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export interface MealPlan {
  meals: MealPlanItem[];
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

export interface MealPlanItem {
  id: number;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

// Custom Recipe (for adding new recipes)
export interface CustomRecipe {
  id?: string;
  title: string;
  image?: string;
  readyInMinutes: number;
  servings: number;
  cuisines: string[];
  diets: string[];
  instructions: string;
  ingredients: CustomIngredient[];
  isCustom: boolean;
}

export interface CustomIngredient {
  id?: string;
  name: string;
  amount: number;
  unit: string;
}

// Shopping List
export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
  recipeId?: number;
  recipeTitle?: string;
}