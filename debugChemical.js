require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Chemical = require('./models/Chemical');

const run = async () => {
  await connectDB();
  try {
    const chemical = new Chemical({
      name: 'Sample Chemical name',
      price: 0,
      addedBy: new mongoose.Types.ObjectId(),
      image: 'https://via.placeholder.com/600x400?text=Chemical+Image',
      brand: 'Sample Brand',
      category: 'Fertilizer',
      type: 'Fertilizer',
      quantity: 0,
      unit: 'kg',
      description: 'Sample description',
    });
    await chemical.save();
    console.log("SUCCESS");
  } catch(e) {
    console.log("ERROR:", e.message);
  }
  process.exit(0);
}
run();
