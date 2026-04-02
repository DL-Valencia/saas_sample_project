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
    const { name, email, password, role, companyName, companyAddress, tinNumber } = req.body;

    if (!name || !email || !password || !companyName || !companyAddress || !tinNumber) {
        return res.status(400).json({ message: 'Please provide all required fields (name, email, password, company name, address, and TIN)' });
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
        companyName,
        companyAddress,
        tinNumber,
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        companyAddress: user.companyAddress,
        tinNumber: user.tinNumber,
        isActive: user.isActive,
        createdAt: user.createdAt,
    });
};

// @desc    Update user details, role, or status
// @route   PATCH /api/users/:id
// @access  Private/SuperAdmin
const updateUser = async (req, res) => {
    const { name, role, isActive, companyName, companyAddress, tinNumber } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = name || user.name;
        user.role = role || user.role;
        user.isActive = isActive !== undefined ? isActive : user.isActive;
        user.companyName = companyName || user.companyName;
        user.companyAddress = companyAddress || user.companyAddress;
        user.tinNumber = tinNumber || user.tinNumber;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
            companyName: updatedUser.companyName,
            companyAddress: updatedUser.companyAddress,
            tinNumber: updatedUser.tinNumber,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'SuperAdmin') {
            return res.status(400).json({ message: 'Cannot delete SuperAdmin accounts' });
        }
        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
