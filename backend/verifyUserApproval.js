const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const verifyApproval = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Find a pending user
        const user = await User.findOne({ status: 'pending' });

        if (!user) {
            console.log('No pending user found.');
            process.exit();
        }

        console.log('Found pending user:', user.telegramUsername);

        // Attempt to approve
        console.log('Attempting to approve user...');
        user.status = 'approved';
        await user.save();

        console.log('User approved successfully!');
        console.log('Current status:', user.status);

        process.exit();
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyApproval();
