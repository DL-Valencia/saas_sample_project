const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Application = require('./models/Application');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Application.deleteMany();

        // Create Users
        const superAdmin = await User.create({
            name: 'Super Admin',
            email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
            password: process.env.SEED_ADMIN_PASSWORD || 'admin123', // Pre-save hook will hash it
            role: 'SuperAdmin',
            companyName: 'Admin Solutions Corp',
            companyAddress: '123 Admin St, Tech City',
            tinNumber: '123456789012',
        });

        const normalUser = await User.create({
            name: 'John Doe',
            email: process.env.SEED_USER_EMAIL || 'user@example.com',
            password: process.env.SEED_USER_PASSWORD || 'user123',
            role: 'User',
            companyName: 'John Doe Enterprise',
            companyAddress: '456 User Lane, Sandbox Inc',
            tinNumber: '987654321098',
        });

        console.log('Users created.');

        // Create Applications
        await Application.create([
            {
                title: 'Project Alpha Budget',
                description: 'Budget approval for the upcoming marketing campaign.',
                status: 'Approved',
                user: normalUser._id,
                history: [{ status: 'Draft', changedBy: normalUser._id, comment: 'Draft created' }, { status: 'Approved', changedBy: superAdmin._id, comment: 'Budget looks good' }]
            },
            {
                title: 'New Hire Request - DevOps',
                description: 'Approval needed for hiring 2 DevOps engineers.',
                status: 'Submitted',
                user: normalUser._id,
                history: [{ status: 'Draft', changedBy: normalUser._id, comment: 'Draft created' }, { status: 'Submitted', changedBy: normalUser._id, comment: 'Urgent request' }]
            },
            {
                title: 'AWS Cloud Migration',
                description: 'Proposal for migrating legacy servers to AWS.',
                status: 'Reviewed',
                user: normalUser._id,
                history: [{ status: 'Reviewed', changedBy: superAdmin._id, comment: 'Reviewing technical specs' }]
            }
        ]);

        console.log('Applications created.');
        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
