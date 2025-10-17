const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/signupModel');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/landing');
};

router.get('/signup', isNotAuthenticated, (req, res) => {
  res.render('signup');
});

router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/landing', isAuthenticated, (req, res) => {
  res.render('landing', { user: req.user });
});

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/landing');
  } else {
    res.redirect('/login');
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const newUser = new User({
      fullName,
      email,
      phone
    });

    await User.register(newUser, password);

    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully!' 
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error creating account' 
    });
  }
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Login error' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        redirect: '/landing'
      });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Logout error' 
      });
    }
    res.redirect('/login');
  });
});

module.exports = router;