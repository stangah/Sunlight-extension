var request = require('request');
var csv = require('csv');
var storage = require('./storage.js');
var config = require('./config.json');


module.exports.populate = function() {
  request('https://raw.github.com/unitedstates/bill-nicknames/master/bill-nicknames.csv?access_token=' + config.GITHUB_API, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      csvParse(body);
    }
  });
};

var csvParse = function(csvIn) {
  csv()
  .from.string(csvIn)
  .to.array(function(data) {
    console.log(data);
    console.log(arrayToObj(data, 3));
  });
};

var arrayToObj = function(array, keyCol) {
  var result = {};
  for (var i = 1; i < array.length; i++) {
    result[array[i][keyCol]] = result[array[i][keyCol]] || [];
    storage.bills[array[i][keyCol]] = storage.bills[array[i][keyCol]] || [];
    var tempObj = {
      type: 'bill'
    };
    for (var j = 0; j < array[i].length; j++) {
      tempObj[array[0][j]] = array[i][j];
    }
    result[array[i][keyCol]].push(tempObj);
    storage.bills[array[i][keyCol]].push(tempObj);
    storage.wordList[array[i][keyCol]] = 'bills';
  }
  return result;
};