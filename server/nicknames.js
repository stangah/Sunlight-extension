var request = require('request'),
    csv = require('csv'),
    storage = require('./storage.js'),
    config = require('./config.json');


// Populate word list with terms to search for
module.exports.populate = function() {
  request('https://raw.github.com/unitedstates/bill-nicknames/master/bill-nicknames.csv?access_token=' + config.GITHUB_API, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      csvParse(body);
    }
  });
};

// Info on Github is a CSV, sadly
var csvParse = function(csvIn) {
  csv()
  .from.string(csvIn)
  .to.array(function(data) {
    // console.log(data);
    // console.log(arrayToObj(data, 3));
    arrayToObj(data, 3);
  });
};

// Turns the array output from CSV into an object
var arrayToObj = function(array, keyCol) {
  var result = {},
      tempObj = { type: 'bill' };

  for (var i = 1; i < array.length; i++) {
    result[array[i][keyCol]] = result[array[i][keyCol]] || [];
    storage.nicknames[array[i][keyCol]] = storage.nicknames[array[i][keyCol]] || [];

    for (var j = 0; j < array[i].length; j++) {
      tempObj[array[0][j]] = array[i][j];
    }
    tempObj.bill_id = tempObj.bill_type + tempObj.bill_number + '-' + tempObj.congress; // hr3590-111
    result[array[i][keyCol]].push(tempObj);
    storage.nicknames[array[i][keyCol]].push(tempObj);
    storage.wordList[array[i][keyCol]] = {
      type: 'bills',
      id: tempObj.bill_id
    };
  }
  return result;
};