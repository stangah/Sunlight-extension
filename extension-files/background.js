var background = {};

background.updateWordList = function() {
  console.log('grabbing word list');
  $.get("http://localhost:8080/list", function(data) {
    data = JSON.parse(data);
    console.log(data);
    dataLowerCase = {};
    for(var key in data) {
      dataLowerCase[key.toLowerCase()] = data[key];
    }
    // chrome.storage.sync.set({
    //   'list': JSON.stringify(dataLowerCase)
    // });
    window.list = dataLowerCase;
  });
};


background._addListeners = function() {
  chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    switch(req.method) {

      case 'page.sendText':
      console.log('matching!');
        background.matchNSend(req.data);
        break;

    }
  });
};


background.matchNSend = function(string) {
  // chrome.storage.sync.get('list', function(data) {
    // var list = JSON.parse(data.list);
    // var list = window.list;
    console.log(list);
    var patternString = '';
    for (var key in list) {
      if (patternString === '') {
        patternString += key;
      } else {
        patternString += '|' + key;
      }
    }
    var pattern = new RegExp(patternString, 'gi');
    var matchNames = _.uniq(string.match(pattern), false, function(item) {
      return item.toLowerCase();
    });
    var matches = {};
    for (var i = 0; i < matchNames.length; i++) {
      matches[matchNames[i]] = list[matchNames[i].toLowerCase()];
    }
    console.log(matches);
    // console.log(matchNames);
    // console.log(patternString);
    background.sendMatches(matches);
  // });
};


background.sendMatches = function(matches) {
  chrome.runtime.sendMessage({
    method: "bg.matches",
    data: matches
  });
};



background.initialize = function() {
  background._addListeners();
  background.updateWordList();

};

background.initialize();
console.log('background checking in!');
