var grabWordList = function() {
  console.log('grabbing word list');
  $.get("http://localhost:8080/list", function(data) {
    console.log(JSON.parse(data));
    chromely.store('list', data);
  });
};

// var send = function(title, data) {
//   chrome.runtime.sendMessage({
//     greeting: title,
//     data: data
//   });
// };

// var listen = function(title, callback) {
//   chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       if (request.greeting === title) {
//         callback(request);
//       }
//   });
// };

// grabWordList();

// var wordList;

// chrome.tabs.onUpdated.addListener(function(id, info, tab){
//   if (info.status === 'complete'){
//     console.log('listening ', info.status);
//     chrome.tabs.executeScript(null, {"file": "./pageReader.js"});
//   }
// });

// chrome.storage.sync.get('list', function(data) {
//   wordList = data.list;
// });

// var checkText = function() {

// };

var patternMatch = function(string, criteria) {
  var list = chromely.retrieve('list', function(list) {
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
    var matches = _.uniq(string.match(pattern), false, function(item) {
      return item.toLowerCase();
    });
    console.log(matches);
    console.log(patternString);
    return matches;
  });
};

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting == "hello") {
//       send('hello', 'Sending Back!');
//     } else if (request.greeting == "page-reader") {
//       console.log('logging');
//       patternMatch(request.var1);
//       // console.log(request.var1);
//     } else if (request.greeting == "get-words") {
//       sendList();
//     }
// });

chromely.listen('page-reader', function(req) {
  console.log('logging');
  chromely.send('matches', patternMatch(req.data));
});

chromely.listen('get-words', function(req) {
  sendList();
});

// chromely.listen('gimme', function() {
//   console.log('hi');
// });

console.log('background checking in!');


var sendList = function() {
  console.log('sending word list');
  chromely.retrieve('list', function(data) {
    send("wordList", data);
    console.log(data);
  });
};
