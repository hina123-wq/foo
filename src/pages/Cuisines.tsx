import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCuisines } from '../services/api';

const cuisineImages: Record<string, string> = {
  'Italian': 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Mexican': 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Chinese': 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Indian': 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'French': 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Japanese': 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Thai': 'https://images.pexels.com/photos/1234535/pexels-photo-1234535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Greek': 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Spanish': 'https://images.pexels.com/photos/12419160/pexels-photo-12419160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Mediterranean': 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'American': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Middle Eastern': 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Korean': 'https://images.pexels.com/photos/5589050/pexels-photo-5589050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Vietnamese': 'https://images.pexels.com/photos/1437590/pexels-photo-1437590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'African': 'https://images.pexels.com/photos/7656553/pexels-photo-7656553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

// Default image for cuisines that don't have a specific image
const defaultCuisineImage = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const Cuisines: React.FC = () => {
  const { data: cuisines, isLoading } = useQuery({
    queryKey: ['cuisines'],
    queryFn: getCuisines,
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-5 bg-gray-300 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-t-lg"></div>
              <div className="p-4 bg-white border border-gray-200 rounded-b-lg">
                <div className="h-6 bg-gray-300 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Cuisines</h1>
        <p className="text-gray-600">Discover recipes from different culinary traditions around the world.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {cuisines?.map((cuisine) => (
          <motion.div 
            key={cuisine} 
            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            variants={item}
            whileHover={{ y: -5 }}
          >
            <Link to={`/cuisines/${cuisine}`}>
              <div className="relative h-48">
                <img 
                  src={cuisineImages[cuisine] || defaultCuisineImage} 
                  alt={`${cuisine} cuisine`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white">{cuisine}</h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Cuisines;