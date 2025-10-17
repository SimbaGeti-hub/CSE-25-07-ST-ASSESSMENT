const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/signupModel');

// Middleware: Check if authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// Middleware: Check if NOT authenticated
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

const validateName = (name) => {
  return name.length >= 3 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name);
};

const validatePassword = (password) => {
  return password.length >= 6 && password.length <= 128;
};

// Routes

// GET: Signup page
router.get('/signup', isNotAuthenticated, (req, res) => {
  res.render('signup');
});

// GET: Login page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

// GET: Dashboard (protected)
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('landing', { user: req.user });
});

// GET: Root redirect
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// POST: Signup with comprehensive validation
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Check all fields are present
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate full name
    if (!validateName(fullName.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name must be 3-50 characters and contain only letters',
        field: 'fullName'
      });
    }

    // Validate email format
    if (!validateEmail(email.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address',
        field: 'email'
      });
    }

    // Validate phone number
    if (!validatePhone(phone.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number must be 10-15 digits',
        field: 'phone'
      });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters',
        field: 'password'
      });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match',
        field: 'confirmPassword'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered',
        field: 'email'
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'This phone number is already registered',
        field: 'phone'
      });
    }

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim()
    });

    // Register user with passport-local-mongoose
    await User.register(newUser, password);

    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully!' 
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages[0] || 'Validation error'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating account. Please try again.'
    });
  }
});

// POST: Login with validation
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  if (email.trim().length < 3) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please enter a valid email or phone number' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters' 
    });
  }

  // Authenticate with passport
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred during authentication' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: info?.message || 'Invalid email or password' 
      });
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'An error occurred during login' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        redirect: '/dashboard'
      });
    });
  })(req, res, next);
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error during logout' 
      });
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;