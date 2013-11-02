var chromely = {};

chromely.send = function(title, data) {
  return chrome.runtime.sendMessage({
    greeting: title,
    data: data
  });
};

chromely.sendTab = function(title, data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      greeting: title,
      data: data
    });
  });
};

chromely.listen = function(title, callback) {
  return chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting === title) {
        return callback(request);
      }
  });
};

chromely.store = function() {
  var args = Array.prototype.slice.call(arguments);
  if ((typeof args[0] === 'string') && args[1]){
    var keyStr = args[0];
    return chrome.storage.sync.set({
      key: args[1]
    });
  } else if (typeof args[0] === 'object') {
    for (var key in args[0]) {
      chrome.storage.sync.set({
        key: args[0][key]
      });
    }
  }
};

chromely.retrieve = function(title, callback) {
  chrome.storage.sync.get(title, function(data) {
    return callback(JSON.parse(data[title]));
  });
};