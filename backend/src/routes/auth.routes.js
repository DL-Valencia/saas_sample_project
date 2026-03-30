const express = require('express');
const {
    registerUser,
    loginUser,
    refreshToken,
    getUserProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/profile', protect, getUserProfile);

module.exports = router;
