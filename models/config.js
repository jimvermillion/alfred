const mongoose = require('mongoose');

var configSchema = new mongoose.Schema({
  owner_id: String,
  location: {
    lat: String,
    long: String
  },
  color: {
    main: { type: String, default: '#ffffff' },
    accent: { type: String, default: '#2196F3' }
  },
  modules: Array
});

module.exports = exports = mongoose.model('Config', configSchema);
