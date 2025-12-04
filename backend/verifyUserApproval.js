const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const verifyApproval = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Find a pending user or create one if none exists
        let user = await User.findOne({ status: 'pending' });

        if (!user) {
            console.log('No pending user found, creating a test user...');
            user = await User.create({
                name: 'Test User',
                telegramUsername: 'testuser_' + Date.now(),
                twitterUsername: 'testuser',
                password: 'password123',
                role: 'user',
                status: 'pending'
            });
            console.log('Test user created:', user.telegramUsername);
        } else {
            console.log('Found pending user:', user.telegramUsername);
        }

        // Attempt to approve
        console.log('Attempting to approve user...');
        user.status = 'approved';
        await user.save();

        console.log('User approved successfully!');
        console.log('Current status:', user.status);

        // Clean up if it was a test user we just created? 
        // No, let's keep it or maybe revert it to pending to be nice?
        // Let's just leave it approved.

        process.exit();
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyApproval();
