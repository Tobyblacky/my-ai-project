const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Define Cart schema inline
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

const getAuthUserId = (event) => {
  const token = event.headers.authorization?.split(' ')[1];
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

exports.handler = async (event, context) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI not configured');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const userId = getAuthUserId(event);
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    if (event.httpMethod === 'GET') {
      // Get cart
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
      return {
        statusCode: 200,
        body: JSON.stringify(cart)
      };
    }

    if (event.httpMethod === 'POST') {
      const { action, productId, name, price, image, quantity } = JSON.parse(event.body);

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      if (action === 'add') {
        const existingItem = cart.items.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity += quantity || 1;
        } else {
          cart.items.push({ productId, name, price, image, quantity: quantity || 1 });
        }
      } else if (action === 'remove') {
        cart.items = cart.items.filter(item => item.name !== name);
      } else if (action === 'update') {
        const item = cart.items.find(item => item.name === name);
        if (item) {
          item.quantity = quantity;
        }
      } else if (action === 'clear') {
        cart.items = [];
      }

      await cart.save();
      return {
        statusCode: 200,
        body: JSON.stringify(cart)
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Cart error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
