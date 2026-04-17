const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log('Registration request received:', req.body);
    // Mock successful registration
    res.status(201).json({
        _id: 'mock-user-id',
        name: req.body.name || 'Mock User',
        email: req.body.email || 'mock@example.com',
        role: 'admin',
        token: generateToken('mock-user-id'),
    });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    // Mock successful login
    res.json({
        _id: 'mock-user-id',
        name: 'Mock User',
        email: req.body.email || 'mock@example.com',
        role: 'admin',
        token: generateToken('mock-user-id'),
    });
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
};
