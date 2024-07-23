const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  count: Number,
  logs: Array
});

const User = mongoose.model('User', userSchema);

module.exports = User;