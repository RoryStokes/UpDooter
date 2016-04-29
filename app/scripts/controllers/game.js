'use strict';

angular.module('upDooter').controller('game', function($scope, PostService, ShopService, StorageService) {
  var _ = window._;

  $scope.getPosts = PostService.getPosts;

  var getDoots = function() { return $scope.updoots };
  $scope.updoots = StorageService.bind('updoots', getDoots) || 0;


  $scope.getShop = ShopService.getShop;

  var potentialDoots;

  var getPotentialDoots = function() {
    return ShopService.getItemCounts()[1];
  };

  var getPotentialComments = function(){
    return ShopService.getItemCounts()[2];
  };

  var canAfford = function(item){
    return item.cost <= $scope.updoots;
  };

  $scope.dootPercent = function(post){
    var progress = (post.updoots+post.selfdooted)/(getPotentialDoots() + 1);
    return Math.round(progress*100);
  };

  $scope.canAfford = canAfford;

  $scope.buy = function(item){
    if(canAfford(item)){
      $scope.updoots -= item.cost;
      ShopService.buy(item);
    }
  };

  $scope.doot = function(post){
    if(post.selfdooted){
      //undoot
      $scope.updoots --;
      post.selfdooted = false;
    }
    else {
      //updoot
      $scope.updoots ++;
      post.selfdooted = true;
    }
    //localStorageService.set('posts', $scope.posts);
  };

  $scope.post =_.throttle(PostService.makePost, 100);

  var tickCount = 0;

  var updatePost = function(post) {
    if (!post[remainderName]) {
      post[remainderName] = 0;
    }

  };

  var tick = function() {
    var posts = PostService.getPosts();
    tickCount++;
    var divisor = 1;
    var i = 0;
    var potentialDoots = getPotentialDoots();
    var potentialComments = getPotentialComments();

    while (((tickCount % divisor) == 0) && (i < posts.length)) {
      var post = posts[i];

      if (!post.progress) {
        post.progress =  post.updoots / potentialDoots;
      }

      if (post.updoots < potentialDoots) {
        post.progress += 0.02 * (1 - post.progress);
        var dootDiff = Math.round(post.progress*potentialDoots) - post.updoots;

        var doubleProgress = Math.min((post.progress * 2), 1);
        var commentDiff = Math.round(doubleProgress*potentialComments*post.commentRand) - post.commentCount;

        if(dootDiff > 0) {
          post.updoots += dootDiff;
          $scope.updoots += dootDiff;
        }
        if(commentDiff > 0) {
          post.commentCount += commentDiff
        }

      }

      divisor *= 2;
      i++;
    }
  };

  var digestTick = function() {
    $scope.$apply(tick);
  };

  var clock = setInterval(digestTick, 100);
  setInterval(StorageService.save, 5000);
});