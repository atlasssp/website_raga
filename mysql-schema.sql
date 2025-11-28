-- Raga by Mallika Database Schema for MySQL
-- Run this SQL script in your phpMyAdmin or MySQL client to create all required tables

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS profiles;

-- Profiles table (extends user authentication)
CREATE TABLE profiles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  original_price INT DEFAULT NULL,
  category_id VARCHAR(36),
  sizes JSON DEFAULT ('["S", "M", "L", "XL", "XXL", "3XL"]'),
  colors JSON DEFAULT ('["Default"]'),
  stock INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category_id (category_id),
  INDEX idx_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images table
CREATE TABLE product_images (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cod',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
-- The password is already hashed with bcrypt
INSERT INTO profiles (id, name, email, password, role) VALUES
(UUID(), 'Admin', 'admin@ragabymallika.com', '$2a$10$8K1p/a0dL3LzBQXNbVKJ4eFoSZ0L7OtBOj0T3dPw3M5yN4F5LmHOe', 'admin');

-- Insert default categories
INSERT INTO categories (id, name, description) VALUES
(UUID(), 'Kurtis', 'Traditional and contemporary kurtis'),
(UUID(), 'Lehengas', 'Elegant lehengas for special occasions'),
(UUID(), 'Co-ord Sets', 'Modern coordinated outfit sets'),
(UUID(), 'Anarkali Sets', 'Beautiful Anarkali dress sets'),
(UUID(), 'Pure Cottons', 'Comfortable pure cotton wear');

-- Get category IDs for product insertion
SET @kurti_id = (SELECT id FROM categories WHERE name = 'Kurtis' LIMIT 1);
SET @lehenga_id = (SELECT id FROM categories WHERE name = 'Lehengas' LIMIT 1);
SET @coord_id = (SELECT id FROM categories WHERE name = 'Co-ord Sets' LIMIT 1);
SET @anarkali_id = (SELECT id FROM categories WHERE name = 'Anarkali Sets' LIMIT 1);
SET @cotton_id = (SELECT id FROM categories WHERE name = 'Pure Cottons' LIMIT 1);

-- Insert sample products
INSERT INTO products (id, name, description, price, category_id, stock, featured) VALUES
(UUID(), 'Elegant Silk Kurti', 'Beautiful handwoven silk kurti with intricate designs', 3999, @kurti_id, 10, TRUE),
(UUID(), 'Designer Cotton Kurti', 'Comfortable cotton kurti perfect for daily wear', 1499, @kurti_id, 15, TRUE),
(UUID(), 'Royal Lehenga Set', 'Traditional lehenga with golden zari work', 12999, @lehenga_id, 8, TRUE),
(UUID(), 'Bridal Lehenga', 'Premium bridal lehenga with heavy embroidery', 25999, @lehenga_id, 5, TRUE),
(UUID(), 'Trendy Co-ord Set', 'Modern co-ord set with contemporary design', 2499, @coord_id, 20, FALSE),
(UUID(), 'Summer Co-ord', 'Light and breezy summer co-ord set', 1899, @coord_id, 18, FALSE),
(UUID(), 'Anarkali Dress', 'Elegant anarkali with dupatta', 3499, @anarkali_id, 12, TRUE),
(UUID(), 'Pure Cotton Dress', 'Comfortable pure cotton dress material', 1299, @cotton_id, 25, FALSE);

-- Insert sample product images
-- Note: You'll need to add the actual product IDs after products are created
-- This is a template - adjust the product_id values accordingly
SET @product1_id = (SELECT id FROM products WHERE name = 'Elegant Silk Kurti' LIMIT 1);
SET @product2_id = (SELECT id FROM products WHERE name = 'Designer Cotton Kurti' LIMIT 1);
SET @product3_id = (SELECT id FROM products WHERE name = 'Royal Lehenga Set' LIMIT 1);

INSERT INTO product_images (id, product_id, image_url) VALUES
(UUID(), @product1_id, '/images/products/4.jpg'),
(UUID(), @product2_id, '/images/products/9.jpg'),
(UUID(), @product3_id, '/images/products/10.jpg'),
(UUID(), @product1_id, '/images/products/11.jpg'),
(UUID(), @product2_id, '/images/products/12.jpg');
