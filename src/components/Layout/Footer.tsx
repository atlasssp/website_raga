import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const whatsappNumber = '+918886999477';
  const whatsappMessage = 'Hi! I would like to know more about your products.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="footer-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/images/Raga_Logo.jpg" 
                alt="RAGA BY MALLIKA" 
                className="h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your destination for beautiful ethnic wear. We offer a curated collection of kurtis, lehengas, 
              co-ord sets, and traditional Indian clothing with modern elegance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/ragabymallika/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Kurtis" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Kurtis
                </Link>
              </li>
              <li>
                <Link to="/products?category=Lehengas" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Lehengas
                </Link>
              </li>
              <li>
                <Link to="/products?category=Co-ord Sets" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Co-ord Sets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Anarkali Sets" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Anarkali Sets
                </Link>
              </li>
              <li>
                <Link to="/products?category=Pure Cottons" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Pure Cottons
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold gradient-text">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">{whatsappNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">info@ragabymallika.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-1" />
                <span className="text-gray-300">
                  9/180-1, Brahmapuram<br />
                  Near High School<br />
                  Pedana, Andhra Pradesh 521366<br />
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 RAGA BY MALLIKA. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-gray-300 text-sm mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for fashion lovers</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 animate-pulse"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  );
};

export default Footer;