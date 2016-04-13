'use strict';

var app = angular.module('upDooter', ['LocalStorageModule']);
app.controller('game', function($scope, localStorageService) {
  $scope.updoots = 0;
  localStorageService.bind($scope, 'updoots');

  var maxPosts = 5;

  $scope.posts = [];

  $scope.doot = function(post){
    if(post.updooted){
      //undoot
      $scope.updoots --;
      post.updooted = false;
    }
    else {
      //updoot
      $scope.updoots ++;
      post.updooted = true;
    }
  };
  var posts = 1;
  $scope.post = function() {
    var post = {text: "NEW POST"+posts, updooted: false};
    $scope.posts.unshift(post);
    if($scope.posts.length>maxPosts){
      $scope.posts.pop();
    }
    posts ++;
  };
});