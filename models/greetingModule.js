const mongoose = require('mongoose');

var greetingModuleSchema = new mongoose.Schema({
  type: 'greeting',
  options: {
    greetingStyle: {
      type: String,
      enum: ['timebased', 'random', 'randomTicker'],
      default: 'timebased'
    }
  }
});

module.exports = exports = mongoose.model('GreetingModule', greetingModuleSchema);
