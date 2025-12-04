const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const adminUser = new User({
            name: 'Admin',
            telegramUsername: 'admin',
            twitterUsername: 'admin',
            password: 'password123',
            role: 'admin',
            status: 'approved',
        });

        await adminUser.save();

        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: password123');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
