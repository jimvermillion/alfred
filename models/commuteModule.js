const mongoose = require('mongoose');

var commuteModuleSchema = new mongoose.Schema({
  type: 'commute',
  options: {
    origin: {
      lat: { type: Number, min: -90, max: 90 },
      long: { type: Number, min: -180, max: 180 }
    },
    destination: {
      lat: { type: Number, min: -90, max: 90 },
      long: { type: Number, min: -180, max: 180 }
    },
    units: {
      type: String,
      enum: ['imperial', 'metric'],
      default: 'imperial'
    },
    mode: {
      type: String,
      enum: ['walking', 'driving'],
      default: 'driving'
    }
  }
});

module.exports = exports = mongoose.model('CommuteModule', commuteModuleSchema);
