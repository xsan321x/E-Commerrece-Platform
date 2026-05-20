import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    console.log('[Register] Attempt started');
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('[Register] Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('[Register] JWT_SECRET is not set!');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET not set'
      });
    }

    console.log('[Register] Checking if user exists:', email);
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[Register] User already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    console.log('[Register] Creating new user');
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('[Register] User created, generating token');
    // Generate token
    const token = generateToken(user._id);

    console.log('[Register] Registration successful for:', user.email);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    console.error('[Register] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log('[Login] Attempt started');
    console.log('[Login] Request body:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[Login] Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('[Login] JWT_SECRET is not set!');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET not set'
      });
    }

    console.log('[Login] Finding user with email:', email);
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('[Login] User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('[Login] User found, checking password');
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('[Login] Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('[Login] Password valid, generating token');
    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    console.log('[Login] Login successful for user:', user.email);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('[Login] Error:', error);
    console.error('[Login] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user data'
    });
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};
