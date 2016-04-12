'use strict';

var app = angular.module('upDooter', []);
app.controller('game', function($scope) {
  $scope.updoots = 0;

  $scope.updoot = function(){
    $scope.updoots ++;
    console.log($scope.updoots);
  };
});