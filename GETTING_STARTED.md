# Adesewa Store - Getting Started Guide

## 📋 Quick Checklist

- [ ] **1. System Setup** - Install Node.js and Git
- [ ] **2. Create Accounts** - GitHub, Netlify, MongoDB Atlas, Stripe
- [ ] **3. Fork Repository** - Clone to your computer
- [ ] **4. Local Setup** - Install dependencies, create .env
- [ ] **5. Test Locally** - Run `npm run dev`
- [ ] **6. Seed Database** - Load sample products
- [ ] **7. Git Push** - Push code to GitHub
- [ ] **8. Deploy to Netlify** - Connect GitHub and deploy
- [ ] **9. Test Live** - Visit your live website
- [ ] **10. Customize** - Add your products and branding

---

## Step-by-Step Setup

### 1️⃣ **Install Node.js**
- Go to nodejs.org
- Download LTS version
- Install and verify: `node --version` and `npm --version`

### 2️⃣ **Create Required Accounts** (Free tier available for all)

#### MongoDB Atlas (Database)
1. Visit: mongodb.com/cloud/atlas
2. Create account
3. Create a free cluster
4. Create database user
5. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)

#### Stripe (Payments)
1. Visit: stripe.com
2. Create account
3. Go to Dashboard
4. Get API Keys (Secret and Publishable)
5. Use TEST keys first (starts with `sk_test_` and `pk_test_`)

#### Netlify (Hosting)
1. Visit: netlify.com
2. Sign up with GitHub

### 3️⃣ **Clone the Repository**

```bash
# Clone your repo
git clone https://github.com/yourusername/adesewa-store.git
cd adesewa-store

# Or if this is your first time:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/adesewa-store.git
git branch -M main
git push -u origin main
```

### 4️⃣ **Install Dependencies**

```bash
npm install
```

### 5️⃣ **Create Configuration File**

```bash
# Copy the template
cp .env.example .env

# Edit .env with your credentials
```

**In your `.env` file, add:**

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/adesewa-store?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_random_string_here_at_least_32_characters

# Stripe Keys (TEST keys from dashboard)
STRIPE_SECRET_KEY=sk_test_51I2F6TDMjT6bV8e...
STRIPE_PUBLISHABLE_KEY=pk_test_51I2F6TDMjT6bV8e...

# URLs
API_URL=http://localhost:8888
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 6️⃣ **Run Locally**

```bash
npm run dev
```

Visit: http://localhost:3000

### 7️⃣ **Seed Sample Products**

In a new terminal:

```bash
node seed-products.js
```

This loads sample iPhone, Mac, iPad, Watch, and AirPods products.

### 8️⃣ **Test Features**

1. **Register** - Create new account at `/public/auth.html`
2. **Browse Products** - Visit product pages
3. **Add to Cart** - Add items to cart
4. **Test Checkout** - Use Stripe test card: `4242 4242 4242 4242`

### 9️⃣ **Push to GitHub**

```bash
git add .
git commit -m "Setup Adesewa backend"
git push origin main
```

### 🔟 **Deploy to Netlify**

1. Go to netlify.com
2. Click "New site from Git"
3. Select your GitHub repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
5. Add environment variables in Netlify dashboard:
   - Site Settings → Build & deploy → Environment
   - Add all variables from your `.env` file
6. Deploy!

---

## 📁 Project Structure

```
adesewa-store/
├── netlify/functions/           # Serverless API functions
│   ├── auth.js                 # Login/Register
│   ├── products.js             # Product catalog
│   ├── cart.js                 # Shopping cart
│   └── orders.js               # Orders & payments
├── public/                      # Frontend files
│   ├── iphone.html             # Product pages
│   ├── cart.html               # Shopping cart
│   ├── auth.html               # Login/Register
│   └── api-client.js           # API communication
├── api/models/                  # Database models
├── package.json
├── netlify.toml               # Netlify configuration
├── .env                       # Your secrets (don't commit!)
└── .env.example              # Template
```

---

## 🔑 Important Files Explained

| File | Purpose |
|------|---------|
| `.env` | Your secrets - NEVER push to GitHub |
| `netlify.toml` | Configuration for Netlify |
| `netlify/functions/*.js` | Your API endpoints (runs on Netlify) |
| `public/api-client.js` | Frontend JavaScript library to call APIs |
| `package.json` | Project dependencies |

---

## 🚨 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| "Cannot find module 'mongoose'" | Run `npm install` |
| "MongoDB URI not configured" | Check your `.env` file |
| "Unauthorized" when adding to cart | Login first at `/public/auth.html` |
| Functions not deploying | Make sure `netlify/functions/` folder exists |
| Stripe errors | Use TEST keys, not live keys |
| CORS errors | Netlify handles this automatically |

---

## 💡 Pro Tips

1. **Always use `.env` for secrets** - Never hardcode keys
2. **Test locally first** - Use `npm run dev` before pushing
3. **Use TEST Stripe keys** - Never use live keys in development
4. **Check Netlify logs** - Site settings → Functions to debug errors
5. **Seed data regularly** - `node seed-products.js` updates products
6. **Monitor costs** - MongoDB Atlas and Stripe have free tiers

---

## 📞 Support Resources

- **Netlify Docs**: netlify.com/docs
- **MongoDB Docs**: mongodb.com/docs
- **Stripe Docs**: stripe.com/docs
- **Node.js Docs**: nodejs.org/docs
- **Forum Support**: Search "Netlify functions with MongoDB"

---

## Next Steps After Deployment

1. ✅ Change Stripe keys from TEST to LIVE
2. ✅ Add real product images and descriptions
3. ✅ Configure custom domain
4. ✅ Set up email notifications
5. ✅ Add analytics
6. ✅ Enable HTTPS (automatic on Netlify)
7. ✅ Monitor performance in Netlify Analytics

---

**You're all set! 🎉 Your API is now live!**

For questions, check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) or [README.md](README.md)
