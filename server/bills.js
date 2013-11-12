var request = require('request');
var config = require('./config.json');
var storage = require('./storage.js');

module.exports.retrieve = function(id) {
  var url = "http://congress.api.sunlightfoundation.com/bills?apikey=" + config.SUNLIGHT_API;
  request(url + '&bill_id=' + id, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log(body);
    }
  });
};