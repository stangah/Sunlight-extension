var request = require('request'),
    storage = require('./storage.js'),
    url = "http://congress.api.sunlightfoundation.com/legislators?apikey=" + process.env.SUNLIGHT_API;

// Populates word list with names of Congressmen to search for
module.exports.populate = function() {
  request(url + '&per_page=all', function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var results = JSON.parse(body).results;

      for (var i = 0; i < results.length; i++) {
        storage.congressmen[ results[i].first_name + ' ' + results[i].last_name ] = results[i];
        storage.wordList[ results[i].first_name + ' ' + results[i].last_name ] = {
          type: 'congressmen',
          id: results[i].bioguide_id
        };
      }
    }
  });
};

// Retrieves info about a congressmen via their bioguide_id
module.exports.retrieveByID = function(id, superRes) {
  request(url + '&bioguide_id=' + id, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      var results = JSON.parse(body).results;
      superRes.json(200, results[0]);
    }
  });

};