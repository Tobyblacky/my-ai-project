# Adesewa Store - Ecommerce Platform

A full-stack ecommerce platform built with HTML/CSS frontend and Node.js backend, deployed on Netlify.

## Features

✅ **Product Management**
- Browse products by category (iPhone, Mac, iPad, Watch, Airpods, etc.)
- Search and filter
- Product details and reviews

✅ **User Authentication**
- User registration and login
- JWT-based authentication
- Secure password hashing

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Cart persistence (server-side)

✅ **Orders & Checkout**
- Complete checkout process
- Order tracking
- Order history

✅ **Payment Processing**
- Stripe integration
- Secure payments
- Multiple payment methods

## Tech Stack

**Frontend:**
- HTML5
- CSS3
- JavaScript (Vanilla)
- API Client Library

**Backend:**
- Node.js
- Express.js (via Netlify Functions)
- MongoDB
- Stripe API
- JWT Authentication

**Deployment:**
- Netlify (Hosting + Serverless Functions)
- MongoDB Atlas (Database)

## Quick Start

### Local Development

1. Clone repository
2. Copy `.env.example` to `.env` and configure credentials
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open http://localhost:3000

### Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete setup instructions.

## Project Structure

```
adesewa-store/
├── public/                 # Static files and HTML
│   └── api-client.js      # Frontend API client
├── netlify/
│   └── functions/         # Serverless API endpoints
│       ├── auth.js        # Authentication
│       ├── products.js    # Product catalog
│       ├── cart.js        # Shopping cart
│       └── orders.js      # Orders & payments
├── api/
│   ├── models/            # MongoDB models
│   ├── middleware/        # Authentication middleware
│   └── utils/             # Utilities
├── package.json           # Dependencies
├── netlify.toml          # Netlify configuration
└── .env.example          # Environment variables template
```

## Environment Variables

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
API_URL=http://localhost:8888
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## API Documentation

### Authentication
```javascript
// Register
const result = await api.register('username', 'email@example.com', 'password');
localStorage.setItem('token', result.token);

// Login
const result = await api.login('email@example.com', 'password');
```

### Products
```javascript
// Get all products
const products = await api.getProducts();

// Get by category
const iphones = await api.getProducts('iPhone');

// Get single product
const product = await api.getProduct(productId);
```

### Cart
```javascript
// Get cart
const cart = await api.getCart();

// Add to cart
await api.addToCart(productId, name, price, image, quantity);

// Remove from cart
await api.removeFromCart(name);

// Update quantity
await api.updateCartItem(name, quantity);
```

### Orders
```javascript
// Get orders
const orders = await api.getOrders();

// Checkout
const result = await api.checkout();
// Redirects to Stripe checkout
```

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub or contact support@adesewa.store

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Inventory management dashboard
- [ ] Advanced analytics
- [ ] Multi-vendor support
- [ ] Wishlist feature
- [ ] Product recommendations
- [ ] Live chat support
- [ ] Email marketing integration
