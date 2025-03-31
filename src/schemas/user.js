require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI) //you need to put your own mongoDB connection string in here
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB:", err));


const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    totalXp: {type: Number, default: 0},
    level: { type: Number, default: 1 },
    lastXPTime: { type: Date, default: Date.now },
    xpMultiplier: { type: Number, default: 1 }, // The multiplier (1 = no multiplier)
    messagesWithMultiplier: { type: Number, default: 0 }, // Number of messages remaining with multiplier
});

    
const User = mongoose.model('User', userSchema);
    
module.exports = {User};
    