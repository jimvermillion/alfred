module.exports = exports = {
  dbError: function(err, res) {
    console.log(err);
    return res.status(500).json({
      msg: 'There was an error'
    });
  },
  noData: function(type, res) {
    return res.status(200).json({
      msg: 'Could not find ' + type
    });
  }
};
