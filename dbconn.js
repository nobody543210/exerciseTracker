const mongoose = require('mongoose');
require('dotenv').config();
const DB_URI = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, { bufferCommands: false });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB