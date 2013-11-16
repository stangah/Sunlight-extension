// Proper case-ness
var toProperCase = function (string) {
    return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


// Angular goodness
angular.module('sunExt', ['ui.bootstrap'])
.config(['$compileProvider', '$locationProvider', function($compileProvider, $locationProvider) {

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
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'gimme' });
      });
    };

    // Listens for matches from background.js
    chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
      if (req.method === 'bg.matches') {
        $scope.matches = req.data;
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
          data.name = toProperCase(data.name);
          break;
        case 'congressmen':
          if (data.state_rank) { data.state_rank = toProperCase(data.state_rank); }
          break;
        case 'bills':
          data.bill_id = data.bill_id.toUpperCase();
          billProgressEval(data);
          break;
      }

      $scope[type].matches[key] = data;
    };

    $scope.getMatches();

}])
.directive('glossaryDirective', function() {
  return {
    restrict: "EAC",
    templateUrl: "client/templates/glossary.html"
  };
})
.directive('billsDirective', function() {
  return {
    restrict: "EAC",
    templateUrl: "client/templates/bills.html"
  };
})
.directive('congressmenDirective', function() {
  return {
    restrict: "EAC",
    templateUrl: "client/templates/congressmen.html"
  };
});


// Creates data used in building progress bar
var billProgressEval = function(data) {
  data.progress = 1;

  if (data.history.enacted) {
    data.progress = 4;
    data.status = "Enacted";
  }

  if (data.history.house_passage_result === 'pass') {
    data.progress++;
  } else {
    data.status = "Waiting on House passage";
  }

  if (data.history.senate_passage_result === 'pass') {
    data.progress++;
  } else {
    if (data.status === 2) {
      data.status = "Waiting on Senate passage";
    } else {
      data.status = "Waiting on Passage in both houses.";
    }
  }

};
