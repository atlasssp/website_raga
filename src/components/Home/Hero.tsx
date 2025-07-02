import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative hero-gradient overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-yellow-300 float">
        <Sparkles className="h-8 w-8 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-10 text-yellow-400 float" style={{ animationDelay: '1s' }}>
        <Star className="h-6 w-6 animate-pulse" />
      </div>
      <div className="absolute top-1/2 left-1/4 text-yellow-200 float" style={{ animationDelay: '2s' }}>
        <Sparkles className="h-4 w-4 animate-pulse" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo Section */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <img 
                src="/images/Raga_Logo.jpg" 
                alt="RAGA BY MALLIKA" 
                className="h-28 w-auto object-contain filter drop-shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-shadow">
                <span className="gradient-text block mb-2">
                  Elegant
                </span>
                <span className="text-gray-800 block mb-2">
                  Ethnic Wear
                </span>
                <span className="text-gray-600 text-3xl md:text-4xl lg:text-5xl block">
                  for Every Occasion
                </span>
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0 text-shadow">
                Discover our exquisite collection of traditional Indian clothing. From beautiful kurtis 
                to stunning lehengas, find the perfect outfit that celebrates your style and heritage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="group btn-gold px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-white"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="btn-outline-gold px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center bg-white/80 backdrop-blur-sm"
              >
                Browse Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4 card-hover">
                <div className="text-2xl font-bold gradient-text">500+</div>
                <div className="text-sm text-gray-700 font-medium">Happy Customers</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4 card-hover">
                <div className="text-2xl font-bold gradient-text">100+</div>
                <div className="text-sm text-gray-700 font-medium">Unique Designs</div>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-4 card-hover">
                <div className="text-2xl font-bold gradient-text">5★</div>
                <div className="text-sm text-gray-700 font-medium">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 float">
              <img
                src="/images/products/9.jpg"
                alt="Beautiful ethnic wear collection"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl product-card"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 glass p-4 rounded-xl shadow-lg z-20 card-hover">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-800">Free Shipping</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 glass p-4 rounded-xl shadow-lg z-20 card-hover">
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">₹1999+</div>
                <div className="text-xs text-gray-600">Starting Price</div>
              </div>
            </div>

            {/* Additional floating element */}
            <div className="absolute top-1/2 -right-8 glass p-3 rounded-full shadow-lg z-20 card-hover">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;