/*
  # Create products and categories schema with image storage

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer)
      - `original_price` (integer, nullable)
      - `category_id` (uuid, foreign key)
      - `sizes` (text array)
      - `colors` (text array)
      - `stock` (integer)
      - `featured` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `alt_text` (text)
      - `sort_order` (integer)
      - `created_at` (timestamp)

  2. Storage
    - Create storage bucket for product images
    - Set up RLS policies for image access

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  original_price integer,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sizes text[] DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  colors text[] DEFAULT ARRAY['Default'],
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are editable by authenticated users"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Products policies
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products are editable by authenticated users"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Product images policies
CREATE POLICY "Product images are viewable by everyone"
  ON product_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Product images are editable by authenticated users"
  ON product_images
  FOR ALL
  TO authenticated
  USING (true);

-- Storage policies
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(sort_order);

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES
  ('Kurtis', 'Beautiful traditional kurtis in various styles', '/images/products/4.jpg'),
  ('Lehengas', 'Elegant lehengas for special occasions', '/images/products/9.jpg'),
  ('Co-ord Sets', 'Trendy coordinated sets for modern women', '/images/products/10.jpg'),
  ('Anarkali Sets', 'Classic Anarkali suits with timeless appeal', '/images/products/11.jpg'),
  ('Pure Cottons', 'Comfortable pure cotton collections', '/images/products/12.jpg')
ON CONFLICT (name) DO NOTHING;