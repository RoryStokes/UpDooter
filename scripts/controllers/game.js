'use strict';

angular.module('upDooter').controller('game', function($scope, PostService, ShopService, StorageService) {
  var _ = window._;

  var commentDootProb = 0.1;

  $scope.getPosts = PostService.getPosts;

  var getDoots = function() { return $scope.updoots };
  $scope.updoots = StorageService.bind('updoots', getDoots) || 0;


  $scope.getShop = ShopService.getShop;

  var dp100 = 0;

  var lastDoots = _.times(100, _.constant(0));

  var addDoots = function(doots) {
    $scope.updoots += doots;
    console.log(lastDoots);
    var old = lastDoots.shift();
    console.log(old);
    lastDoots.push(doots);
    dp100 += doots-old;
  };

  $scope.getDps = function() {
    return dp100/100;
  };

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

      //Set up autoposting on first buy of poster
      if(!autoPosting && item.id == 3){
        autoPost()
      }
    }
  };

  $scope.doot = function(post){
    if(post.selfdooted){
      //undoot
      $scope.updoots -= post.commentCount + 1;
      post.selfdooted = false;
    }
    else {
      //updoot
      $scope.updoots += post.commentCount + 1;
      post.selfdooted = true;
    }
    //localStorageService.set('posts', $scope.posts);
  };

  $scope.post =_.throttle(PostService.makePost, 100);

  var tickCount = 0;

  var approxNormalRand =  function() {
    return (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 6;
  };

  var autoPosting = null;

  var applyAutoPost = function() {
    $scope.$apply(autoPost);
  };

  var autoPost = function() {
    PostService.makePost();
    var timeToNext = 60000 * approxNormalRand() / ShopService.getItemCounts()[3];
    autoPosting = window.setTimeout(applyAutoPost, timeToNext);
  };

  if(ShopService.getItemCounts()[3]){
    autoPost();
  }

  var tick = function() {
    var posts = PostService.getPosts();
    tickCount++;
    var divisor = 1;
    var i = 0;
    var potentialDoots = getPotentialDoots();
    var potentialComments = getPotentialComments();
    var doots = 0;

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
          var dootables = post.commentCount * dootDiff;
          var commentDoots = 0;

          if(dootables > 0){
            var noDootProb = Math.pow((1-commentDootProb), dootables);
            var rand = Math.random();

            if(rand > noDootProb){
              //bonus doots are happening, lets do some filthy maths
              var normy = approxNormalRand();
              commentDoots = Math.round(normy*dootables);
            }
          }
          post.updoots += dootDiff;
          post.commentDoots += commentDoots;
          doots += dootDiff + commentDoots;
        }
        if(commentDiff > 0) {
          if(post.selfdooted){
            $scope.updoots += commentDiff;
          }
          post.commentCount += commentDiff;
        }

      }

      divisor *= 2;
      i++;
    }

    addDoots(doots);
  };

  var digestTick = function() {
    $scope.$apply(tick);
  };

  var clock = setInterval(digestTick, 100);
  setInterval(StorageService.save, 5000);
});