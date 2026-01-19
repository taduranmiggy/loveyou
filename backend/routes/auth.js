const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'loveyou-super-secret-key-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '7d';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, name } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Parse name if firstName/lastName not provided
    let fName = firstName;
    let lName = lastName;
    if (!firstName && name) {
      const nameParts = name.trim().split(' ');
      fName = nameParts[0];
      lName = nameParts.slice(1).join(' ') || 'User';
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: fName || 'Lovely',
      lastName: lName || 'User',
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user',
      hasCompletedOnboarding: false,
      preferences: user.preferences,
    };

    res.status(201).json({
      message: 'Registration successful! Welcome to LoveYou 💕',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'user',
      hasCompletedOnboarding: !!user.preferences?.onboarding?.completed,
      onboardingData: user.preferences?.onboarding || null,
      preferences: user.preferences,
    };

    res.json({
      message: 'Login successful! Welcome back 🦫💕',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Logout user
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more robust implementation, you'd invalidate the token
    // For now, the client just needs to delete the token
    res.json({ message: 'Logged out successfully! See you soon 💕' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userData = {
      id: req.user.id,
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`.trim(),
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role || 'user',
      hasCompletedOnboarding: !!req.user.preferences?.onboarding?.completed,
      onboardingData: req.user.preferences?.onboarding || null,
      preferences: req.user.preferences,
      profilePicture: req.user.profilePicture,
      dateOfBirth: req.user.dateOfBirth,
      timezone: req.user.timezone,
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, nickname, dateOfBirth, timezone, preferences, onboardingData } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (timezone) updates.timezone = timezone;
    
    // Handle preferences update (merge with existing)
    if (preferences || onboardingData) {
      const currentPrefs = req.user.preferences || {};
      updates.preferences = {
        ...currentPrefs,
        ...preferences,
        onboarding: onboardingData ? { ...onboardingData, completed: true } : currentPrefs.onboarding,
      };
    }

    await req.user.update(updates);

    const userData = {
      id: req.user.id,
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`.trim(),
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      hasCompletedOnboarding: !!req.user.preferences?.onboarding?.completed,
      onboardingData: req.user.preferences?.onboarding || null,
      preferences: req.user.preferences,
    };

    res.json({
      message: 'Profile updated successfully! 💕',
      user: userData,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await req.user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully! 🔐' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
