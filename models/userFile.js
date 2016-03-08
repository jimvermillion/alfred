const mongoose = require('mongoose');

const Config = require(__dirname + '/config.js');


userFileSchema = mongoose.Schema({
  owner_id: {
    type: String,
    required: true
  },
  name: {
    first: String,
    last: String
  },
  greeting: {
    type: String,
    default: 'Hello, '
  },
  default_config: String,
  twitter_token: String,
  weather_token: String,
});

// Initialize
userFileSchema.methods.initialize = function() {
  // Create new config doc and return it
  return new Promise((resolve, reject) => {
    var newConfig = new Config();
    newConfig.owner_id = this.owner_id;
    newConfig.save((err, savedConfig) => {
      // Reject promise
      if (err) return reject(err);
      // Save Default
      this.setAsDefault(savedConfig._id);
      // Resolve Promise
      return resolve(savedConfig);
    });
  });
}

// Set default config
userFileSchema.methods.setAsDefault = function(config_id) {
  this.default_config = config_id;
};

module.exports = exports = mongoose.model('UserFile', userFileSchema);