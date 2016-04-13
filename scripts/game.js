'use strict';

var app = angular.module('upDooter', ['LocalStorageModule']);
app.controller('game', function($scope, localStorageService) {
  var maxPosts = 10;

  localStorageService.bind($scope, 'updoots');
  if(!$scope.updoots) {
    $scope.updoots = 0;
  }
  $scope.posts = localStorageService.get('posts');
  if(!$scope.posts){
    $scope.posts = [];
  }


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
  var makePost = function() {
    var post = {text: "NEW POST"+posts, updooted: false};
    $scope.posts.unshift(post);
    if($scope.posts.length>maxPosts){
      $scope.posts.pop();
    }
    posts ++;

    localStorageService.set('posts', $scope.posts);
  };

  $scope.post =_.throttle(makePost, 100);
});