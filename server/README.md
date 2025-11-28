# Raga by Mallika - Backend API

This is the backend API server for Raga by Mallika e-commerce platform.

## Setup Instructions

### 1. Database Setup

Your database credentials are already configured:
- Host: mysql.gb.stackcp.com:41499
- Database: ragabymallika
- Username: ragabymallika
- Password: aaryan@123
- Remote IP: 139.5.250.49

To set up the database:
1. Connect to your MySQL database using phpMyAdmin or MySQL client
2. Run the SQL script from `server/database/schema.sql`
3. This will create all necessary tables and insert default data

### 2. Server Configuration

The `.env.example` file already contains your database credentials. Simply copy it:

```bash
cp server/.env.example server/.env
```

The configuration is:
```env
DB_HOST=mysql.gb.stackcp.com
DB_USER=ragabymallika
DB_PASSWORD=aaryan@123
DB_NAME=ragabymallika
DB_PORT=41499

JWT_SECRET=raga_by_mallika_secret_2025_production
PORT=3001

FRONTEND_URL=https://ragabymallika.in
```

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get user orders (all orders for admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Default Admin Login

- Email: admin@ragabymallika.com
- Password: admin123

**IMPORTANT:** Change the admin password after first login!

## Deployment on Serverbyt

1. Upload the `server` folder to your Serverbyt hosting
2. Create a `.env` file with your database credentials
3. Run `npm install` on the server
4. Set up a process manager (PM2) to keep the server running:

```bash
npm install -g pm2
pm2 start server.js --name raga-api
pm2 save
pm2 startup
```

5. Configure your web server (Apache/Nginx) to proxy requests to the Node.js server
