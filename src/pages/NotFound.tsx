import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/recipes')}
            className="bg-transparent hover:bg-gray-100 border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Browse Recipes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;