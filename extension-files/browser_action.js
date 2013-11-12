angular.module('sunExt', ['ui.bootstrap'])
.config(['$compileProvider', '$routeProvider', '$locationProvider', function($compileProvider, $routeProvider, $locationProvider) {

  // $routeProvider
  //   .when('/', {
  //     controller: 'ListController',
  //     templateUrl: 'templates/home.html'
  //   })
  //   .when('/words', {

  //   })
  //   .when('/bills', {

  //   })
  //   .when('/congressmen', {

  //   })
  //   .otherwise({
  //     redirectTo: '/'
  //   });

  //Some chrome extension bullshit
  $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

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

    chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
      if (req.method === 'bg.matches') {
        $log.log('received!');
        $scope.matches = req.data;
        console.log(req.data);
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
        console.log("lol. error.");
      });
    };

    $scope.addStuff = function(key, type, data) {
      $scope[type].size++;
      $scope[type].matches[key] = data;
      console.log(type, data);
    };

    $scope.getMatches = function() {
      $log.log('querying!');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: 'gimme' });
      });
    };

    $scope.getMatches();

}])
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
