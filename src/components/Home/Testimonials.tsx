import React from 'react';
import { Star, Quote, Instagram } from 'lucide-react';
import { testimonials } from '../../data/mockData';

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-shadow">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Read testimonials from our happy customers who love our ethnic wear collection
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card rounded-2xl p-8 relative shadow-lg card-hover"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-yellow-300">
                <Quote className="h-8 w-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-yellow-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-shadow">
            Follow Us on Instagram
          </h3>
          <p className="text-gray-700 mb-8">
            See how our customers style their RAGA BY MALLIKA outfits
          </p>
          
          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              '/images/products/9.jpg',
              '/images/products/11.jpg',
              '/images/products/10.jpg',
              '/images/products/4.jpg'
            ].map((image, index) => (
              <div key={index} className="relative group cursor-pointer card-hover">
                <img
                  src={image}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Instagram className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm font-semibold">View on Instagram</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://www.instagram.com/ragabymallika/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 btn-gold px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            <Instagram className="h-5 w-5" />
            <span>Follow @ragabymallika</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;