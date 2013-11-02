var request = require('request');
var config = require('./config.json');
var storage = require('./storage.js');


module.exports.populate = function() {
  var words = [];
  request('https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress?ref=gh-pages&access_token=' + config.GITHUB_API, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      body = JSON.parse(body);
      for (var i = 0; i < body.length; i++) {
        words.push(body[i].name);
      }
      console.log(words);

      for (i = 0; i < words.length; i++) {
        getDef(words[i]);
      }

    }
  });
};

var glossaryURL = 'https://raw.github.com/unitedstates/glossary/gh-pages/definitions/congress/';

var getDef = function(word) {
  request(glossaryURL + word, function(err, res, def) {
    def = JSON.parse(def);
    var newDef = {
      name: word.split('.')[0],
      short_def: def.short_definition,
      long_def: def.long_definition_text,
      sourceURL: def.source_url
    };
    storage.glossary[newDef.name] = newDef;
    storage.wordList[newDef.name] = 'glossary';
  });
};