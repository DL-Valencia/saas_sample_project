const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Create / Invite a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'A user with that email already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'User',
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    });
};

// @desc    Update user role or status
// @route   PATCH /api/users/:id
// @access  Private/SuperAdmin
const updateUser = async (req, res) => {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = role || user.role;
        user.isActive = isActive !== undefined ? isActive : user.isActive;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
};
