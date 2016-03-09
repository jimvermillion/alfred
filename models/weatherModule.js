const mongoose = require('mongoose');

var weatherModuleSchema = new mongoose.Schema({
  type: 'weather',
  options: {
    location: {
      lat: {
        type: Number,
        min: -90,
        max: 90,
        default: 47.61665
      },
      long: {
        type: Number,
        min: -180,
        max: 180,
        default: -122.35079
      }
    },
    units: {
      type: String,
      enum: ['imperial', 'metric'],
      default: 'imperial'
    }
  }
});

module.exports = exports = mongoose.model('WeatherModule', weatherModuleSchema);
