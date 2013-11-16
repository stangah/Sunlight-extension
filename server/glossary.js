var request = require('request'),
    config = require('./config.json'),
    storage = require('./storage.js');


// Grabs word list and sends words to getDef for definitions
module.exports.populate = function() {
  var words = [];

  request('https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress?ref=gh-pages&access_token=' + config.GITHUB_API, function(err, res, body) {

    if (!err && res.statusCode == 200) {
      body = JSON.parse(body);
      for (var i = 0; i < body.length; i++) {
        words.push(body[i].name);
      }
      // console.log(words);

      for (i = 0; i < words.length; i++) {
        getDef(words[i]);
      }

    }
  });
};

// Retrieves JSON definition data from the repo
var getDef = function(word) {
  var glossaryURL = 'https://raw.github.com/unitedstates/glossary/gh-pages/definitions/congress/';

  request(glossaryURL + word, function(err, res, def) {
    var newDef;

    // Parses data and construct new object
    def = JSON.parse(def);
    newDef = {
      name: word.split('.')[0].toLowerCase(),
      short_def: def.short_definition,
      long_def: def.long_definition_text,
      sourceURL: def.source_url
    };

    // Saves in glossary storage and wordList
    storage.glossary[newDef.name] = newDef;
    storage.wordList[newDef.name] = {
      type: 'glossary',
      id: newDef.name
    };

  });
};