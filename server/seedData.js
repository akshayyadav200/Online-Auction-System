import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Item from './models/Item.js';
import Bid from './models/Bid.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  }
];

const importData = async () => {
  try {
    await connectDB();

    await Item.deleteMany();
    await User.deleteMany();
    await Bid.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Ends 2 days from now
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    // Ended 1 day ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const items = [
      {
        title: 'Vintage Leather Jacket',
        description: 'Authentic 1980s leather jacket in excellent condition.',
        category: 'Clothing',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        startingPrice: 5000,
        currentBid: 5000,
        endTime: twoDaysFromNow,
        createdBy: adminUser,
      },
      {
        title: 'Apple iPhone 14 Pro',
        description: 'Brand new in box, never opened.',
        category: 'Smartphone',
        imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        startingPrice: 50000,
        currentBid: 50000,
        endTime: twoDaysFromNow,
        createdBy: adminUser,
      },
      {
        title: 'Ancient Chinese Vase',
        description: 'Ming dynasty replica vase, stunning details.',
        category: 'Vase',
        imageUrl: 'https://images.unsplash.com/photo-1579567761406-4684ee0ca962?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        startingPrice: 15000,
        currentBid: 15000,
        endTime: twoDaysFromNow,
        createdBy: adminUser,
      },
      {
        title: 'Signed Babe Ruth Baseball',
        description: 'Auction has ended. A legendary piece of history.',
        category: 'Baseball',
        imageUrl: 'https://images.unsplash.com/photo-1508344928928-7137b29de218?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        startingPrice: 200000,
        currentBid: 250000,
        endTime: oneDayAgo,
        createdBy: adminUser,
      }
    ];

    await Item.insertMany(items);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
