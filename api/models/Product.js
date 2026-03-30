const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  tagline: String,
  image: String,
  description: String,
  category: {
    type: String,
    enum: ['iPhone', 'Mac', 'iPad', 'Watch', 'Airpods', 'Accessories', 'Services', 'Tecno', 'Infinix', 'Itel'],
    index: true
  },
  stock: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
