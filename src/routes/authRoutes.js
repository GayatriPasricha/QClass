const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/google
// @desc    Auth/Register user via Google OAuth ID token
// @access  Public
router.post('/google', async (req, res) => {
    const { credential, role } = req.body;

    if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
    }

    try {
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error('GOOGLE_CLIENT_ID is not configured in backend .env file');
            return res.status(500).json({ 
                message: 'Google authentication is not configured on the server. Please define GOOGLE_CLIENT_ID in the .env file.' 
            });
        }

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ message: 'Invalid Google credential' });
        }

        const { sub: googleId, email, name, picture: avatar } = payload;

        // Find user by Google ID or by Email (case-insensitive)
        let user = await User.findOne({ 
            $or: [
                { googleId }, 
                { email: email.toLowerCase() }
            ] 
        });

        if (user) {
            // Link Google account if not already linked
            let updated = false;
            if (!user.googleId) {
                user.googleId = googleId;
                updated = true;
            }
            if (avatar && !user.avatar) {
                user.avatar = avatar;
                updated = true;
            }
            if (updated) {
                await user.save();
            }

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        }

        // If user does not exist and no role is selected, return a 404 status
        // so the frontend can display a role selector to complete the signup.
        if (!role) {
            return res.status(404).json({
                message: 'Account not found. Please choose a role to complete your signup.',
                email,
                name,
                avatar,
                googleId,
            });
        }

        if (role !== 'student' && role !== 'teacher') {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Register new user
        user = await User.create({
            name,
            email: email.toLowerCase(),
            role,
            googleId,
            avatar,
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        return res.status(500).json({ message: 'Google Authentication failed. Please try again.' });
    }
});

module.exports = router;
