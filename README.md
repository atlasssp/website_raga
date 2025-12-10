# RAGA BY MALLIKA - Complete Ecommerce Website

A beautiful, modern ecommerce website for ethnic wear with integrated payment solutions and Google authentication.

## 🚀 Features

### 🛍️ **Ecommerce Functionality**
- Product catalog with categories
- Shopping cart with persistent storage
- Product search and filtering
- Responsive design for all devices

### 💳 **Payment Integration**
- **Razorpay** - Secure online payments
- **WhatsApp Checkout** - Traditional order processing
- Dual payment options for customer convenience

### 🔐 **Authentication**
- **Google Sign-In** for customers
- **Admin panel** with traditional login
- User data stored in Supabase database

### 📱 **Modern Features**
- Instagram integration for product imports
- Image upload and management
- Real-time inventory tracking
- WhatsApp order notifications

## 🛠️ **Setup Instructions**

### 1. **Google Authentication Setup**
To enable Google Sign-In, you need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sign-In API
4. Create credentials (OAuth 2.0 Client ID)
5. Add your domain to authorized origins
6. Copy your Client ID and update it in `src/services/authService.ts`:

```typescript
private static readonly GOOGLE_CLIENT_ID = 'your-actual-client-id-here';
```

### 2. **Supabase Database Setup**
The database is already configured with:
- Products and categories tables
- User authentication
- Image storage
- Row Level Security (RLS)

### 3. **Razorpay Payment Setup**
Razorpay is already configured with your live key:
- Key ID: `rzp_live_RkwWM34FBYYRNX`
- Test with small amounts first
- All payments send confirmations to WhatsApp

### 4. **Environment Variables**
Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 **Usage**

### **For Customers:**
1. Sign in with Google (one-click registration)
2. Browse products and add to cart
3. Choose payment method:
   - Pay online with Razorpay
   - Order via WhatsApp

### **For Admin:**
1. Login with admin credentials
2. Manage products and categories
3. Upload product images
4. Import products from Instagram
5. View order reports

### **Admin Credentials:**
- Email: `admin@ragabymallika.com`
- Password: `admin123`

## 📦 **Tech Stack**
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Google Sign-In + Supabase Auth
- **Payments**: Razorpay
- **Storage**: Supabase Storage
- **Deployment**: Vite build

## 🌟 **Key Features**

### **Customer Experience:**
- Beautiful, responsive design
- Easy Google Sign-In
- Flexible payment options
- WhatsApp integration

### **Admin Features:**
- Product management
- Image upload
- Instagram integration
- Order tracking
- Inventory management

### **Security:**
- Row Level Security (RLS)
- Secure payment processing
- Protected admin routes
- Data encryption

## 📱 **Mobile Responsive**
Fully optimized for:
- Mobile phones
- Tablets
- Desktop computers
- All screen sizes

## 🎨 **Design**
- Modern, elegant UI
- Brand-consistent colors
- Smooth animations
- Professional appearance

## 🚀 **Deployment**
Ready for production deployment with:
- Optimized build process
- CDN-ready assets
- Environment configuration
- Scalable architecture

---

**RAGA BY MALLIKA** - Where tradition meets modern technology! 🌟