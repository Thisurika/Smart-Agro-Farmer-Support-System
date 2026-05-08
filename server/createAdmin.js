require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@smartagro.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: adminEmail,
        password: 'admin12345',
        phone: '1234567890',
        address: 'Admin Headquarters',
        role: 'admin'
      });
      console.log('✅ Admin user created successfully!');
    } else {
      admin.role = 'admin';
      admin.password = 'admin12345'; // Trigger re-hash
      await admin.save();
      console.log('✅ Admin user reset successfully!');
    }
    
    console.log('Email: admin@smartagro.com');
    console.log('Password: admin12345');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Admin:', error);
    process.exit(1);
  }
};

createAdmin();
