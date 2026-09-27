import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { mockData } from '../services/mockDataStore.js';
import { generateToken } from '../middleware/authMiddleware.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', company = 'Acme Corp' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        company,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          avatar: user.avatar,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      // In-memory fallback
      const userExists = mockData.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        company,
        status: 'active',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date(),
      };

      mockData.users.push(newUser);

      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          company: newUser.company,
          avatar: newUser.avatar,
          token: generateToken(newUser._id, newUser.role),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
            token: generateToken(user._id, user.role),
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    } else {
      const user = mockData.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
            avatar: user.avatar,
            token: generateToken(user._id, user.role),
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
