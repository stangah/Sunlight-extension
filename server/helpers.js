var csv = require('csv');

module.exports.csvParse = function(csvIn) {
  csv()
  .from.string(csvIn)
  .to.array(function(data) {
    console.log(data);
    console.log(module.exports.arrayToObj(data, 3));
  });
};

module.exports.arrayToObj = function(array, keyCol) {
  var result = {};
  for (var i = 1; i < array.length; i++) {
    result[array[i][keyCol]] = result[array[i][keyCol]] || [];
    var tempObj = {};
    for (var j = 0; j < array[i].length; j++) {
      tempObj[array[0][j]] = array[i][j];
    }
    result[array[i][keyCol]].push(tempObj);
  }
  return result;
};
