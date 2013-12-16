// Proper case-ness
var toProperCase = function (string) {
    return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


// Angular goodness
angular.module('sunExt', ['ui.bootstrap'])
.config(['$compileProvider', '$locationProvider', function($compileProvider, $locationProvider) {

  // Allows angular to recognize chrome-extension protocol
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

    // Kicks off the process by requesting text from the background script
    $scope.getMatches = function(){
      chrome.runtime.sendMessage({ method: "ba.requestMatches" });
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
      var url = 'http://hr-ps-sunlight-extension.azurewebsites.net/' + matches[key].type + '/' + matches[key].id;

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
  data.status = {
    house: true,
    senate: true,
    signed: true
  };

  if (data.history.enacted) {
    data.progress = 4;
  }

  if (data.history.house_passage_result === 'pass') {
    data.progress++;
  } else {
    data.status.house = false;
    data.status.signed = false;
  }

  if (data.history.senate_passage_result === 'pass') {
    data.progress++;
  } else {
    if (data.progress === 2) {
      data.status.senate = false;
      data.status.signed = false;
    } else {
      data.status.house = false;
      data.status.senate = false;
      data.status.signed = false;
    }
  }

};
