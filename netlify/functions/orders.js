const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

// Define Order schema inline
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  stripePaymentId: String,
  shippingAddress: { street: String, city: String, state: String, country: String, zipCode: String },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

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

const Order = mongoose.model('Order', orderSchema);
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
      // Get user's orders
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      return {
        statusCode: 200,
        body: JSON.stringify(orders)
      };
    }

    if (event.httpMethod === 'POST') {
      const { action } = JSON.parse(event.body);

      if (action === 'checkout') {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Cart is empty' })
          };
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: cart.items.map(item => ({
            price_data: {
              currency: 'ngn',
              product_data: {
                name: item.name,
                images: [item.image]
              },
              unit_amount: item.price * 100
            },
            quantity: item.quantity
          })),
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/cart`
        });

        // Create order with pending status
        const order = new Order({
          userId,
          items: cart.items,
          totalAmount,
          stripePaymentId: session.id
        });
        await order.save();

        return {
          statusCode: 200,
          body: JSON.stringify({ sessionId: session.id, orderId: order._id })
        };
      }
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Orders error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
