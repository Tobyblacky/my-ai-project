const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define User schema inline to avoid import issues
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  firstName: String,
  lastName: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { action, username, email, password } = JSON.parse(event.body);

    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI not configured');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    if (action === 'register') {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'User already exists' })
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword
      });

      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return {
        statusCode: 201,
        body: JSON.stringify({
          token,
          user: { id: user._id, username, email }
        })
      };
    }

    if (action === 'login') {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return {
        statusCode: 200,
        body: JSON.stringify({
          token,
          user: { id: user._id, username: user.username, email: user.email }
        })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' })
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
