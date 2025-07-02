import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { products } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

const FeaturedProducts: React.FC = () => {
  const { addToCart, items } = useCart();
  const featuredProducts = products.filter(product => product.featured);

  const handleAddToCart = (product: any) => {
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  const getCartQuantity = (productId: string) => {
    const cartItem = items.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <section className="py-16 bg-pastel-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-shadow">
            Featured Collection
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Handpicked pieces from our latest collection, featuring the finest fabrics and traditional craftsmanship
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => {
            const cartQuantity = getCartQuantity(product.id);
            
            return (
              <div key={product.id} className="group product-card rounded-2xl overflow-hidden shadow-lg">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 glass p-2 rounded-full hover:bg-white/90 transition-all duration-300 group/heart">
                    <Heart className="h-5 w-5 text-gray-600 group-hover/heart:text-red-500 transition-colors" />
                  </button>

                  {/* Quick Actions */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 btn-gold py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>
                          {cartQuantity > 0 ? `Add More (${cartQuantity})` : 'Add to Cart'}
                        </span>
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="glass text-gray-700 py-2 px-4 rounded-lg hover:bg-white/90 transition-colors font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="mb-2">
                    <span className="text-sm text-yellow-600 font-medium">{product.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    
                    {/* Size Options */}
                    <div className="flex items-center space-x-1">
                      {product.sizes.slice(0, 3).map((size) => (
                        <span key={size} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cart Quantity Indicator */}
                  {cartQuantity > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-700 font-medium">
                        {cartQuantity} item{cartQuantity > 1 ? 's' : ''} in cart
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 btn-gold px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            <span>View All Products</span>
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;