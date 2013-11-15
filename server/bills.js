var request = require('request'),
    config = require('./config.json'),
    storage = require('./storage.js');

// Retrieves info on a particular bill given the bill's ID
module.exports.retrieve = function(id, superRes) {
  var url = "http://congress.api.sunlightfoundation.com/bills?apikey=" + config.SUNLIGHT_API;
  request(url + '&bill_id=' + id, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var responseData = JSON.parse(body).results[0];
      // console.log(JSON.parse(body).results);
      superRes.send(JSON.stringify(responseData));
      console.log(responseData);
    }
  });
};