import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, ChefHat } from 'lucide-react';
import { useCustomRecipeStore } from '../store/customRecipeStore';
import { CustomIngredient } from '../types/recipe';

const dietOptions = [
  'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
  'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'
];

const cuisineOptions = [
  'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European',
  'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese',
  'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern',
  'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
];

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const { addRecipe } = useCustomRecipeStore();
  
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [readyInMinutes, setReadyInMinutes] = useState(30);
  const [servings, setServings] = useState(4);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState<CustomIngredient[]>([
    { name: '', amount: 1, unit: '' },
  ]);
  
  const handleCuisineToggle = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };
  
  const handleDietToggle = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter(d => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };
  
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: '' }]);
  };
  
  const updateIngredient = (index: number, field: keyof CustomIngredient, value: string | number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setIngredients(updatedIngredients);
  };
  
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      alert('Please provide a recipe title');
      return;
    }
    
    if (!instructions.trim()) {
      alert('Please provide recipe instructions');
      return;
    }
    
    if (ingredients.length === 0 || ingredients.some(ing => !ing.name.trim())) {
      alert('Please provide at least one ingredient with a name');
      return;
    }
    
    // Add the recipe
    addRecipe({
      title,
      image: image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      readyInMinutes,
      servings,
      cuisines: selectedCuisines,
      diets: selectedDiets,
      instructions,
      ingredients: ingredients.filter(ing => ing.name.trim()),
      isCustom: true,
    });
    
    // Redirect or show success message
    alert('Recipe added successfully!');
    navigate('/recipes');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Your Recipe</h1>
        <p className="text-gray-600">Share your culinary creations with the community.</p>
      </div>
      
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="e.g., Homemade Chocolate Chip Cookies"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://example.com/your-recipe-image.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">Leave empty to use a default image</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="readyInMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Time (minutes)*
              </label>
              <input
                type="number"
                id="readyInMinutes"
                min="1"
                value={readyInMinutes}
                onChange={(e) => setReadyInMinutes(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                Servings*
              </label>
              <input
                type="number"
                id="servings"
                min="1"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => handleCuisineToggle(cuisine)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCuisines.includes(cuisine)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diet Categories (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => handleDietToggle(diet)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedDiets.includes(diet)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients*
            </label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ingredient name"
                  required
                />
                <input
                  type="number"
                  value={ingredient.amount}
                  min="0"
                  step="0.1"
                  onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value))}
                  className="w-20 p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="unit"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove ingredient"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-orange-500 hover:text-orange-600 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Ingredient
            </button>
          </div>
          
          <div className="mb-8">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions*
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Provide step-by-step instructions for preparing this recipe..."
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Add Recipe
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRecipe;