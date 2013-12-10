var background = {};

background.list = {};
background.tabMatches = {};

background._updateWordList = function() {
  $.get("http://localhost:8080/list", function(data) {
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
      background.matchNStore(req.data, sender.tab.id);
    } else if (req.method === 'ba.requestMatches') {
      background.sendCurrentTab();
    }
  });

  // Update the badge with the number of matches
  chrome.tabs.onHighlighted.addListener(function(obj) {
    background.updateBadge(obj.tabIds[0]);
  });

};

// Update icon badge which displays number of matches to the user
background.updateBadge = function(ID) {
  if (background.tabMatches[ID] && background.tabMatches[ID].size > 0) {
    chrome.browserAction.setBadgeText({
      text: background.tabMatches[ID].size.toString()
    });

    //Set the background color of the badge
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  } else {
    chrome.browserAction.setBadgeText({
      text: ''
    });
  }
};

// Testing for alternate data routing
background.matchNStore = function(string, tabID) {
  var patternString = '',
      pattern,
      matchNames,
      matches = {},
      sizeMatches = 0;

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
    sizeMatches++;
  }

  background.tabMatches[tabID] = {};
  background.tabMatches[tabID].matches = matches;
  background.tabMatches[tabID].size = sizeMatches;
  background.updateBadge(tabID);
};

background.sendCurrentTab = function() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    background.sendMatches(background.tabMatches[tabs[0].id].matches);
  });

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
