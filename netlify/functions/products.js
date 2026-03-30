const mongoose = require('mongoose');

// Define Product schema inline
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  tagline: String,
  image: String,
  description: String,
  category: { type: String, index: true },
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String, createdAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

exports.handler = async (event, context) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI not configured');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const category = event.queryStringParameters?.category;
    const productId = event.queryStringParameters?.id;

    // Get single product
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Product not found' })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(product)
      };
    }

    // Get products by category or all
    let query = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    return {
      statusCode: 200,
      body: JSON.stringify(products)
    };
  } catch (error) {
    console.error('Products error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
