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

  var potentialDoots;

  var updateDoots = function(){
    potentialDoots = (itemCounts[1] || 0);
  };

  updateDoots();

  var getCost = function(item){
    return Math.floor(item.baseCost*Math.pow(1.1,item.count));
  };
  $scope.shop.getCost = getCost;

  var canAfford = function(item){
    return getCost(item) <= $scope.updoots;
  };

  var dootPercent = function(post){
    var progress = post.updoots/(potentialDoots + 1);
    return Math.round(progress*100);
  };
  $scope.dootPercent = dootPercent;
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
  	  updateDoots();
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


  $scope.test = function(){
    var post = $scope.posts[0];
    console.log(dootPercent(post));
  };

  var posts = 1;

  var newPost = function(text){
    return {text: text, selfdooted: false, updoots: 0, progress: 0};
  };

  var makePost = function() {
    var post = newPost("NEW POST"+posts);
    $scope.posts.unshift(post);
    if($scope.posts.length>maxPosts){
      $scope.posts.pop();
    }
    posts ++;

    localStorageService.set('posts', $scope.posts);
  };

  $scope.post =_.throttle(makePost, 100);

  var currentPost;
  var remainder = 0;

  var tick = function(){
    if(currentPost != $scope.posts[0]){
      currentPost = $scope.posts[0];
      remainder = 0;
    }

    if(currentPost.updoots < potentialDoots){
      var progress = currentPost.updoots/potentialDoots;
      var step = potentialDoots*0.02*(1-progress) + remainder;
      var newDoots = Math.floor(step);
      remainder = step-newDoots;
      $scope.$apply(function(){
        currentPost.updoots += newDoots;
        $scope.updoots += newDoots;
      });
    }
  };

  var clock = setInterval(tick, 100);
});