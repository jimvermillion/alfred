const mongoose = require('mongoose');

const Widget = require(__dirname + '/widget');

var configSchema = new mongoose.Schema({
  name: {type: String, default: 'My Profile'},
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


// Populate modules array with Widgets
configSchema.methods.populateModules = function(){
  return new Promise((resolve, reject) => {
    Widget.find({
      _id: {
        $in: this.modules
      }
    }, (err, foundWidgets) => {
      if(err) return reject(err);

      if(!foundWidgets.length) {
        return reject('No widgets found.')
      }

      resolve(foundWidgets);
    });
  });
}

module.exports = exports = mongoose.model('Config', configSchema);
