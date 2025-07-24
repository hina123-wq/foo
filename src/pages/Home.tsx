import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronRight, Search, ChefHat as Chef, Apple, ShoppingBag, BookOpen } from 'lucide-react';
import { getRandomRecipes } from '../services/unifiedApi';
import RecipeCardGrid from '../components/recipe/RecipeCardGrid';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['randomRecipes', 8],
    queryFn: () => getRandomRecipes(8),
  });

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-orange-500" />,
      title: 'Recipe Discovery',
      description: 'Browse through thousands of recipes from all around the world.',
      link: '/recipes',
    },
    {
      icon: <Chef className="w-8 h-8 text-orange-500" />,
      title: 'Diet Planning',
      description: 'Create personalized diet plans based on your preferences and goals.',
      link: '/diet-planner',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-orange-500" />,
      title: 'Shopping Lists',
      description: 'Generate shopping lists automatically from your favorite recipes.',
      link: '/shopping-list',
    },
    {
      icon: <Apple className="w-8 h-8 text-orange-500" />,
      title: 'Nutrition Tracking',
      description: 'Track your nutritional intake and make better food choices.',
      link: '/nutrition',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
            filter: 'brightness(0.5)'
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center text-white">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Delicious Recipes For Every Taste
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 max-w-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find inspiration for your next meal, create shopping lists, and plan your diet with ease.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => navigate('/recipes')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Recipes
            </button>
            <button 
              onClick={() => navigate('/diet-planner')}
              className="bg-transparent hover:bg-white hover:bg-opacity-20 border-2 border-white text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Create Diet Plan
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Everything You Need For Your Cooking Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Fresh Healthy Bite provides all the tools you need to discover new recipes, plan your meals, and make shopping easier.</p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                variants={item}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button 
                  onClick={() => navigate(feature.link)}
                  className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors"
                >
                  Explore <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Recipes</h2>
            <button 
              onClick={() => navigate('/recipes')}
              className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <RecipeCardGrid recipes={recipes || []} isLoading={isLoading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start cooking?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of food enthusiasts who have discovered their next favorite meal with Fresh Healthy Bite.</p>
          <button 
            onClick={() => navigate('/recipes')}
            className="bg-white text-orange-500 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;