var request = require('request'),
    storage = require('./storage.js');

// Retrieves info on a particular bill given the bill's ID
module.exports.retrieve = function(id, superRes) {
  var url = "http://congress.api.sunlightfoundation.com/bills?apikey=" + process.env.SUNLIGHT_API;

  request(url + '&bill_id=' + id, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var responseData = JSON.parse(body).results[0];

      superRes.json(200, responseData);
    }
  });
};
