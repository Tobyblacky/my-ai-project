# Adesewa Store - Netlify Deployment Guide

## Complete Setup Instructions

### Step 1: Prerequisites
- Node.js (v14+) installed
- GitHub account (for version control)
- Netlify account (free)
- MongoDB Atlas account (free tier available)
- Stripe account (for payments)

### Step 2: Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**

   **MongoDB Setup:**
   - Go to mongodb.com/cloud/atlas
   - Create a free cluster
   - Create database user and get connection string
   - Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adesewa-store`

   **Stripe Setup:**
   - Go to stripe.com and create account
   - Get keys from Dashboard
   - Add to `.env`:
     ```
     STRIPE_SECRET_KEY=sk_test_xxxxx
     STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
     ```

   **JWT Secret:**
   - Generate random string (e.g., using: `openssl rand -base64 32`)
   - Add to `.env`: `JWT_SECRET=your_random_string`

### Step 3: Seed Sample Products

Create file `seed-products.js`:

```javascript
const mongoose = require('mongoose');
const Product = require('./api/models/Product');
require('dotenv').config();

const products = [
  {
    name: 'iPhone 17',
    tagline: 'The future in your pocket.',
    price: 1200000,
    category: 'iPhone',
    image: 'https://tse2.mm.bing.net/th/id/OIP.qoGKxse28XKHyq3C8cMz7gHaHa?rs=1&pid=ImgDetMain',
    stock: 50
  },
  // Add more products...
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Products seeded!');
  mongoose.connection.close();
});
```

Run: `node seed-products.js`

### Step 4: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000

### Step 5: Deploy to Netlify

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/adesewa-store.git
   git push -u origin master
   ```

2. **Connect to Netlify:**
   - Go to netlify.com
   - Click "New site from Git"
   - Connect GitHub
   - Select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `public`
     - Functions directory: `netlify/functions`

3. **Add Environment Variables:**
   - In Netlify dashboard: Site settings → Build & deploy → Environment
   - Add all variables from `.env`

4. **Deploy:**
   - Netlify will auto-deploy on git push
   - Visit your live site!

### Step 6: Update Frontend HTML Files

Move your HTML files to `public/` and update script references:

```html
<script src="/api-client.js"></script>
<script>
  // Use window.api for API calls
  async function loadProducts() {
    try {
      const products = await api.getProducts('iPhone');
      // Render products...
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
</script>
```

## API Endpoints

### Authentication
- **POST** `/api/auth` - Register/Login
  ```json
  { "action": "register", "username": "john", "email": "john@example.com", "password": "pass123" }
  ```

### Products
- **GET** `/api/products` - Get all products
- **GET** `/api/products?category=iPhone` - Get by category
- **GET** `/api/products?id=productId` - Get single product

### Cart (Requires Authentication)
- **GET** `/api/cart` - Get user's cart
- **POST** `/api/cart` - Add/Remove/Update items
  ```json
  { "action": "add", "name": "iPhone 17", "price": 1200000, "image": "url", "quantity": 1 }
  ```

### Orders (Requires Authentication)
- **GET** `/api/orders` - Get user's orders
- **POST** `/api/orders` - Create checkout session
  ```json
  { "action": "checkout" }
  ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "MongoDB URI not configured" | Check `.env` file, restart dev server |
| CORS errors | Netlify functions handle CORS automatically |
| Stripe errors | Verify keys are correct, test mode enabled |
| Functions not deploying | Check `netlify/functions` folder exists |

## Next Steps

1. Customize product catalog
2. Add email notifications (SendGrid)
3. Set up order tracking
4. Add customer reviews
5. Implement inventory management dashboard
