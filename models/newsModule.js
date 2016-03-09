const mongoose = require('mongoose');

var newsModuleSchema = new mongoose.Schema({
  type: 'news',
  options: {
    newsContent: {
      type: String,
      enum: ['mostPopular', 'topStories'],
      default: 'topStories'
    },
    top: {
      type: Number,
      default: 5
    }
  }
});

module.exports = exports = mongoose.model('NewsModule', newsModuleSchema);
