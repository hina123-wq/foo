import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Recipes from '../pages/Recipes';
import RecipeDetail from '../pages/RecipeDetail';
import DietPlanner from '../pages/DietPlanner';
import ShoppingList from '../pages/ShoppingList';
import NutritionPlanner from '../pages/NutritionPlanner';
import Cuisines from '../pages/Cuisines';
import Favorites from '../pages/Favorites';
import AddRecipe from '../pages/AddRecipe';
import Dashboard from '../pages/Dashboard';
import MealScheduler from '../pages/MealScheduler';
import Goals from '../pages/Goals';
import NotFound from '../pages/NotFound';
import Auth from '../pages/Auth';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="/diet-planner" element={<DietPlanner />} />
      <Route path="/shopping-list" element={<ShoppingList />} />
      <Route path="/nutrition" element={<NutritionPlanner />} />
      <Route path="/cuisines" element={<Cuisines />} />
      <Route path="/cuisines/:cuisine" element={<Recipes />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/add-recipe" element={<AddRecipe />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/meal-scheduler" element={<MealScheduler />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;