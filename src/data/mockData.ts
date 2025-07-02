import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Kurtis',
    description: 'Beautiful traditional kurtis in various styles',
    image: '/images/products/4.jpg'
  },
  {
    id: '2',
    name: 'Lehengas',
    description: 'Elegant lehengas for special occasions',
    image: '/images/products/9.jpg'
  },
  {
    id: '3',
    name: 'Co-ord Sets',
    description: 'Trendy coordinated sets for modern women',
    image: '/images/products/10.jpg'
  },
  {
    id: '4',
    name: 'Anarkali Sets',
    description: 'Classic Anarkali suits with timeless appeal',
    image: '/images/products/11.jpg'
  },
  {
    id: '5',
    name: 'Pure Cottons',
    description: 'Comfortable pure cotton collections',
    image: '/images/products/12.jpg'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Purple & White Anarkali Set',
    description: 'Beautiful purple and white Anarkali set with intricate embroidery and traditional patterns. Perfect for festive occasions.',
    price: 2499,
    originalPrice: 3499,
    images: ['/images/products/11.jpg'],
    category: 'Anarkali Sets',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colors: ['Purple', 'White'],
    stock: 15,
    featured: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mustard Yellow Anarkali Dress',
    description: 'Stunning mustard yellow Anarkali dress with floral prints and traditional embroidery. Made from premium cotton fabric.',
    price: 2799,
    originalPrice: 3799,
    images: ['/images/products/9.jpg'],
    category: 'Anarkali Sets',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colors: ['Mustard Yellow'],
    stock: 12,
    featured: true,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    name: 'Black & White Co-ord Set',
    description: 'Elegant black and white coordinated set with modern floral patterns. Perfect for casual and semi-formal occasions.',
    price: 1899,
    originalPrice: 2499,
    images: ['/images/products/10.jpg'],
    category: 'Co-ord Sets',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colors: ['Black', 'White'],
    stock: 20,
    featured: false,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    name: 'Brown Umbrella Print Saree',
    description: 'Unique brown saree with umbrella prints and golden border. Made from pure cotton with comfortable drape.',
    price: 1599,
    originalPrice: 2199,
    images: ['/images/products/12.jpg'],
    category: 'Pure Cottons',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colors: ['Brown', 'Golden'],
    stock: 8,
    featured: false,
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    name: 'Blue Elephant Print Suit',
    description: 'Traditional blue suit with elephant prints and intricate border designs. Perfect for cultural events and festivals.',
    price: 2199,
    originalPrice: 2899,
    images: ['/images/products/4.jpg'],
    category: 'Pure Cottons',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colors: ['Blue', 'White'],
    stock: 10,
    featured: true,
    createdAt: '2024-01-11'
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely beautiful Anarkali set! The quality is amazing and the fit is perfect. Highly recommended!',
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    productId: '2',
    customerName: 'Anjali Patel',
    rating: 5,
    comment: 'Love the mustard color and the fabric quality. Got so many compliments when I wore it!',
    createdAt: '2024-01-19'
  },
  {
    id: '3',
    productId: '3',
    customerName: 'Meera Singh',
    rating: 4,
    comment: 'Great co-ord set for the price. Comfortable and stylish. Will definitely order more!',
    createdAt: '2024-01-18'
  }
];

export const testimonials = [
  {
    id: '1',
    name: 'Kavya Reddy',
    rating: 5,
    comment: 'RAGA BY MALLIKA has the most beautiful collection of ethnic wear. The quality is outstanding and the designs are unique!',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '2',
    name: 'Sneha Gupta',
    rating: 5,
    comment: 'I have ordered multiple times and every piece is perfect. The customer service is excellent too!',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '3',
    name: 'Ritu Agarwal',
    rating: 5,
    comment: 'Best place to shop for ethnic wear online. Fast delivery and amazing quality. Highly recommended!',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
];