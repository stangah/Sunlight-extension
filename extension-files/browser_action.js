// Proper case-ness
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


// Angular goodness
angular.module('sunExt', ['ui.bootstrap'])
.config(['$compileProvider', '$routeProvider', '$locationProvider', function($compileProvider, $routeProvider, $locationProvider) {

  //Some chrome extension poppycock
  $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

  // I forget what this does but I'll assume it's important
  $locationProvider.html5Mode(false);

}])
.controller('TabsController',
  ['$scope', '$http', '$log', function($scope, $http, $log) {

    $scope.bills = {
      size: 0,
      matches: {}
    };
    $scope.glossary = {
      size: 0,
      matches: {}
    };
    $scope.congressmen = {
      size: 0,
      matches: {}
    };

    // Kicks off the whole process by requesting text from the DOM
    $scope.getMatches = function() {
      $log.log('querying!');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'gimme' });
      });
    };

    // Listens for matches from background.js
    chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
      if (req.method === 'bg.matches') {
        $log.log('received!');
        $scope.matches = req.data;
        // console.log(req.data);
        $scope.populate();
      }
    });

    $scope.populate = function() {
      var matches = $scope.matches;
      for(var key in matches) {
        $scope.request(key, matches);
      }
    };

    $scope.request = function(key, matches) {
      var url = 'http://localhost:8080/' + matches[key].type + '/' + matches[key].id;
      console.log(url);
      $http({
        method: 'GET',
        url: url
      }).success(function(data, status, headers, config) {
        $scope.addStuff(key, matches[key].type, data);
      }).error(function(data, status, headers, config) {
        console.log("lol, error.");
      });
    };

    $scope.addStuff = function(key, type, data) {
      $scope[type].size++;

      //Data adjustments
      switch (type) {
        case 'glossary':
          data.name = data.name.toProperCase();
          break;
        case 'congressmen':
          if (data.state_rank) { data.state_rank = data.state_rank.toProperCase(); }
          break;
        case 'bills':
          data.bill_id = data.bill_id.toUpperCase();
          break;
      }

      $scope[type].matches[key] = data;
      // console.log(type, data);
    };

    $scope.getMatches();

}])
// .directive('searchDirective', function() {
//   return {
//     restrict: "EAC",
//     templateUrl: "templates/search.html"
//   };
// })
.directive('glossaryDirective', function() {
  return {
    restrict: "EAC",
    templateUrl: "templates/glossary.html"
  };
})
.directive('billsDirective', function() {
  return {
    restrict: "EAC",
    templateUrl: "templates/bills.html"
  };
})
.directive('congressmenDirective', function() {
  return {
    restrict: "EAC",
    templateUrl: "templates/congressmen.html"
  };
});
