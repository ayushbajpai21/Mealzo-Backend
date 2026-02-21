const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { email, password, displayName, phoneNumber } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            displayName,
            phoneNumber
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Google Auth (Login/Signup)
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
    try {
        const { email, displayName, uid, photoURL } = req.body;
        console.log('Google Auth Request:', { email, displayName, uid });

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('User found, logging in:', user.email);

            // If user exists but doesn't have firebaseUid linked, link it now
            if (!user.firebaseUid) {
                user.firebaseUid = uid;
                if (!user.photoURL && photoURL) user.photoURL = photoURL;
                await user.save();
                console.log('Linked existing user to Firebase UID');
            }

            // User exists, login
            const token = generateToken(user._id);
            return res.status(200).json({
                success: true,
                message: 'Login successful via Google',
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL || photoURL
                }
            });
        } else {
            console.log('New user, creating account:', email);
            // New user, create
            user = await User.create({
                email: email || `user_${uid}@google.com`, // Fallback
                displayName: displayName || 'Google User', // Fallback for required field
                photoURL,
                firebaseUid: uid,
                role: 'customer'
            });

            console.log('User created successfully:', user._id);
            const token = generateToken(user._id);
            res.status(201).json({
                success: true,
                message: 'Account created via Google',
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName
                }
            });
        }
    } catch (error) {
        console.error('Detailed Google Auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during Google Authentication',
            error: error.message // Sending error message to frontend for easier debugging
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
