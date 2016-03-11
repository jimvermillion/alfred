const mongoose = require('mongoose');

const Widget = require(__dirname + '/widget');

var configSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'My Profile'
  },
  owner_id: String,
  location: {
    lat: String,
    long: String
  },
  color: {
    main: {
      type: String,
      default: '#ffffff'
    },
    accent: {
      type: String,
      default: '#2196F3'
    }
  },
  modules: Array
});

// Populate modules array with Widgets
configSchema.methods.populateModules = function() {
  var holder = [];
  return new Promise((resolve, reject) => {
    this.modules.forEach((mod, index) => {

      Widget.findOne({
        _id: mod
      }, (err, data) => {
        if (err) return reject(err);

        // Assign to corresponding position in holder
        holder[index] = (data) ? data : {type: ''};

        if (index === this.modules.length - 1) return resolve(holder);
      });
    });
  });
};

module.exports = exports = mongoose.model('Config', configSchema);
