const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'SuperAdmin'],
        default: 'User',
    },
    permissions: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    companyName: {
        type: String,
        required: [true, 'Please add a company name'],
        maxlength: [50, 'Company Name cannot exceed 50 characters'],
    },
    companyAddress: {
        type: String,
        required: [true, 'Please add a company address'],
        maxlength: [50, 'Company Address cannot exceed 50 characters'],
    },
    tinNumber: {
        type: String,
        required: [true, 'Please add a TIN number'],
        maxlength: [12, 'TIN Number cannot exceed 12 characters'],
        match: [/^\d{0,12}$/, 'TIN Number must be numeric and up to 12 digits'],
    },
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
