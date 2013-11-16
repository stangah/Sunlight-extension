var background = {};

background.list = {};

background._updateWordList = function() {
  $.get("http://localhost:8080/list", function(data) {
    data = JSON.parse(data);
    dataLowerCase = {};
    for(var key in data) {
      dataLowerCase[key.toLowerCase()] = data[key];
    }
    background.list = dataLowerCase;
  });
};


background._addListeners = function() {
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.method === 'page.sendText') {
      background.matchNSend(req.data);
    }
  });
};


background.matchNSend = function(string) {
  var patternString = '',
      pattern,
      matchNames,
      matches = {};

  //Formats regex string with | between terms
  for (var key in background.list) {
    if (patternString === '') {
      patternString += key;
    } else {
      patternString += '|' + key;
    }
  }

  //Searches for matches and stores unique entries
  pattern = new RegExp(patternString, 'gi');
  matchNames = _.uniq(string.match(pattern), false, function(item) {
    return item.toLowerCase();
  });

  // Changes all keys to be lowercase for simplified lookup
  for (var i = 0; i < matchNames.length; i++) {
    matches[matchNames[i]] = background.list[matchNames[i].toLowerCase()];
  }

  background.sendMatches(matches);
};


background.sendMatches = function(matches) {
  chrome.runtime.sendMessage({
    method: "bg.matches",
    data: matches
  });
};



background.initialize = function() {
  background._addListeners();
  background._updateWordList();
};

background.initialize();
