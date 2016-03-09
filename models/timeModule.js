const mongoose = require('mongoose');

var timeModuleSchema = new mongoose.Schema({
  type: 'time',
  options: {
    // hour display format (true: 24hr, false: 12hr)
    twentyFour: { type: Boolean, default: false },
    // day display format (true: Sunday, false: Sun)
    dayLong: { type: Boolean, default: true },
    // month display format (true: March, flase: Mar)
    monthLong: { type: Boolean, default: true }
  }
});

module.exports = exports = mongoose.model('TimeModule', timeModuleSchema);
