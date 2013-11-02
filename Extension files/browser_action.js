angular.module('sunExt', [])
.controller('ListController',
  ['$scope', '$log', function($scope, $log) {

    $scope.getMatches = function() {
      $log.log('sending!');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'gimme' }, function(response) {
          $log.log(response.message);
          // $scope.apply(function() {
          //   console.log(response.matches);
          //   $scope.matches = response.matches;
          // });
        });
      });
    };

}]);




// var goodController = function($scope, $log) {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { greeting: 'gimme' }, function(response) {
//       $log.log(response);
//       $scope.apply(function() {
//         console.log(response.matches);
//         $scope.matches = response.matches;
//       });
//     });
//   });
// };


// .config(function($routeProvider) {
//   $routeProvider.when('/', {
//     controller: 'homeCtrl',
//     // templateUrl: './templates/home.html'
//   }).otherwise({
//     redirectTo: '/'
//   });
// })
// .controller('homeCtrl', function($scope, $log) {

//   $scope.getMatches = function() {
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {
    //     greeting: 'gimme'
    //   }, function(response) {
    //     $log.log('hello world?!?!');
    //     // $scope.apply(function() {
    //     //   console.log(response.matches);
    //     //   $scope.matches = response.matches;
    //     // });
    //   });
    // });
//   };

//   $log.log($scope.getMatches);
//   $log.log('hohihihihi');

  // var link = document.getElementById('link');
  // link.addEventListener('click', $scope.getMatches);

//   // chrome.runtime.onMessage.addListener(
//   //   function(req, sender, res) {
//   //     if (req.greeting === 'matches') {
//   //       $scope.matches = req.matches;
//   //     }
//   // });
// });

var sendGreeting = function() {
  chromely.send('hello', 'variable 1');
  // chrome.runtime.sendMessage({
  //   greeting: "hello",
  //   var1: "variable 1"
  // });
};

var getList = function() {
  chromely.send('get-words', []);
  // chrome.runtime.sendMessage({
  //   greeting: "get-words"
  // });
};

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting == "hello") {
//       console.log(request.var1);
//     } else if (request.greeting == "wordList") {
//       var list = document.getElementById('list');
//       // list.innerHTML = request.var1;
//     }
//   });

// chromely.listen('hello', function(req) {
//   console.log(req.var1);
// });

// chromely.listen('wordList', function(req) {
//   var list = document.getElementById('list');
// });

document.addEventListener('DOMContentLoaded', function() {

});