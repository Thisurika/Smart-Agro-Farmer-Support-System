require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const testDatabase = async () => {
  try {
    console.log('--- DB Verification Test ---');
    await connectDB();

    console.log('\n1. Creating a test farmer user...');
    
    // Check if test user already exists
    let testUser = await User.findOne({ email: 'testfarmer@smartagro.com' });
    
    if (testUser) {
      console.log('Test user already exists. Cleaning up...');
      await User.deleteOne({ email: 'testfarmer@smartagro.com' });
      console.log('Old test user deleted.');
    }

    testUser = await User.create({
      firstName: 'Test',
      lastName: 'Farmer',
      email: 'testfarmer@smartagro.com',
      password: 'password123', // Will be hashed by pre-save middleware
      phone: '1234567890',
      address: '123 Farm Lane, Agro City',
      role: 'user'
    });

    console.log('✅ Test user successfully inserted into MongoDB!');
    
    console.log('\n2. Retrieving test user from DB using Mongoose...');
    const retrievedUser = await User.findById(testUser._id).select('-password');
    
    console.log('✅ Successfully retrieved user data from database:');
    console.log(JSON.stringify(retrievedUser, null, 2));
    
    console.log('\n3. Cleaning up test data...');
    await User.deleteOne({ _id: testUser._id });
    console.log('✅ Test user removed. Database state restored.');

    console.log('\n--- Test Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Test Failed:', error);
    process.exit(1);
  }
};

testDatabase();
