'use strict';

var app = angular.module('upDooter', ['LocalStorageModule']);
app.controller('game', function($scope, localStorageService) {
  $scope.updoots = 0;
  localStorageService.bind($scope, 'updoots')
  $scope.updoot = function(){
    $scope.updoots ++;
    console.log($scope.updoots);
  };
});