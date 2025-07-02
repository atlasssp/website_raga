import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/mockData';

const Categories: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-shadow">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our diverse collection of traditional and contemporary ethnic wear
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group category-card rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Category Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Category Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2 text-shadow">{category.name}</h3>
                  <p className="text-sm opacity-90 line-clamp-2 text-shadow">{category.description}</p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 glass p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Category Details */}
              <div className="p-6 bg-white/90 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600 font-medium">Explore Collection</span>
                  <ArrowRight className="h-5 w-5 text-yellow-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Special Offers */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Offer 1 */}
          <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-white overflow-hidden shadow-lg card-hover">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-shadow">New Arrivals</h3>
              <p className="mb-4 opacity-90 text-shadow">Fresh designs added weekly</p>
              <Link
                to="/products?sort=newest"
                className="inline-flex items-center space-x-2 bg-white text-yellow-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <div className="w-32 h-32 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Offer 2 */}
          <div className="relative bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-8 text-white overflow-hidden shadow-lg card-hover">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-shadow">Special Discount</h3>
              <p className="mb-4 opacity-90 text-shadow">Up to 30% off on selected items</p>
              <Link
                to="/products?discount=true"
                className="inline-flex items-center space-x-2 bg-white text-rose-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                <span>View Offers</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <div className="w-32 h-32 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;