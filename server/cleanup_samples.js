require('dotenv').config();
const mongoose = require('mongoose');
const Chemical = require('./models/Chemical');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const chemicals = await Chemical.find({ name: /Sample/i });
        console.log(`Found ${chemicals.length} sample records.`);
        if (chemicals.length > 0) {
            const result = await Chemical.deleteMany({ name: /Sample/i });
            console.log(`Deleted ${result.deletedCount} sample records.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};
check();
