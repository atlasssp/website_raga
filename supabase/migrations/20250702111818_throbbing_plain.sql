/*
  # Create users table for Google authentication

  1. New Tables
    - `users`
      - `id` (text, primary key) - Google user ID
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `picture` (text) - Google profile picture URL
      - `role` (text, default 'customer')
      - `created_at` (timestamptz, default now())
      - `last_login` (timestamptz)

  2. Security
    - Enable RLS on `users` table
    - Add policies for user data access
*/

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  picture text,
  role text DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id);

-- Allow public read for admin verification (limited fields)
CREATE POLICY "Public can verify admin status"
  ON users
  FOR SELECT
  TO public
  USING (role = 'admin');

-- Allow insert for new user registration
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);