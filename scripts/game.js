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
  var itemCounts = localStorageService.get('itemCounts');
  if(!itemCounts){
    itemCounts = {};
  }

  $scope.shop = {};
  $scope.shop.items = [];
  var lurkers = {id:1,name:'Lurker',baseCost:10};
  $scope.shop.items.push(lurkers);

  _($scope.shop.items).forEach(function(item){
    item.count = itemCounts[item.id] || 0;
  });

  var getCost = function(item){
    return Math.floor(item.baseCost*Math.pow(1.1,item.count));
  };

  var canAfford = function(item){
    return getCost(item) <= $scope.updoots;
  };

  $scope.shop.getCost = getCost;
  $scope.shop.canAfford = canAfford;

  $scope.shop.buy = function(item){
    if(canAfford(item)){
      $scope.updoots -= getCost(item);
      item.count ++;
      if(itemCounts[item.id]){
        itemCounts[item.id] ++;
      }
      else{
        itemCounts[item.id] = 1;
      }
      localStorageService.set('itemCounts', itemCounts)
    }
  };

  $scope.doot = function(post){
    if(post.selfdooted){
      //undoot
      $scope.updoots --;
      post.updoots --;
      post.selfdooted = false;
    }
    else {
      //updoot
      $scope.updoots ++;
      post.updoots ++;
      post.selfdooted = true;
    }
    localStorageService.set('posts', $scope.posts);
  };


  var posts = 1;
  var makePost = function() {
    var post = {text: "NEW POST"+posts, selfdooted: false, updoots: 0};
    $scope.posts.unshift(post);
    if($scope.posts.length>maxPosts){
      $scope.posts.pop();
    }
    posts ++;

    localStorageService.set('posts', $scope.posts);
  };

  $scope.post =_.throttle(makePost, 100);
});