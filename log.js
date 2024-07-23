const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    
        description: String,
        duration: Number,
        date: String,
      
  });
    
    
const Log = mongoose.model('Logs', logSchema);

module.exports = Log;
