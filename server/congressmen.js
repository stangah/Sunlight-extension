var request = require('request');
var config = require('./config.json');
var storage = require('./storage.js');

var url = "http://congress.api.sunlightfoundation.com/legislators?apikey=" + config.SUNLIGHT_API;

module.exports.populate = function() {
  request(url + '&per_page=all', function(err, res, body) {
    if (!err && res.statusCode == 200) {
      // console.log(body);
      var results = JSON.parse(body).results;
      console.log(results.length);
      for (var i = 0; i < results.length; i++) {
        storage.congressmen[ results[i].first_name + ' ' + results[i].last_name ] = results[i];
        storage.wordList[ results[i].first_name + ' ' + results[i].last_name ] = {
          type: 'congressmen',
          id: results[i].bioguide_id
        };
      }
      console.log(storage);
    }
  });
};

module.exports.retrieveByID = function(id, superRes) {
  console.log(id);
  request(url + '&bioguide_id=' + id, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      // console.log(body);
      var results = JSON.parse(body).results;
      superRes.send(results[0]);
      // console.log(results[0])
    }
  });
};