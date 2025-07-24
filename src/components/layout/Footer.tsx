import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Heart, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-400" />
              <span className="text-xl font-bold">Fresh Healthy Bite</span>
            </Link>
            <p className="mt-4 text-gray-300 text-sm">
              Discover delicious recipes, create meal plans, and organize your cooking journey with ease.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/recipes" className="text-gray-300 hover:text-white transition-colors">Recipes</Link></li>
              <li><Link to="/cuisines" className="text-gray-300 hover:text-white transition-colors">Cuisines</Link></li>
              <li><Link to="/diet-planner" className="text-gray-300 hover:text-white transition-colors">Diet Plans</Link></li>
              <li><Link to="/nutrition" className="text-gray-300 hover:text-white transition-colors">Nutrition</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/shopping-list" className="text-gray-300 hover:text-white transition-colors">Shopping List</Link></li>
              <li><Link to="/add-recipe" className="text-gray-300 hover:text-white transition-colors">Add Recipe</Link></li>
              <li><Link to="/favorites" className="text-gray-300 hover:text-white transition-colors">Favorites</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get the latest recipes and tips.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Fresh Healthy Bite. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;