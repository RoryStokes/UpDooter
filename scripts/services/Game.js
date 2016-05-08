'use strict';

angular.module('upDooter').service('Game', function($rootScope, StorageService, PostService, ShopService) {
  var commentDootProb = 0.1;
  var getDoots = function() { return updoots };
  var updoots = StorageService.bind('updoots', getDoots) || 0;

  var dp100 = 0;

  var lastDoots = _.times(100, _.constant(0));

  var addDoots = function(doots) {
    updoots += doots;
    var old = lastDoots.shift();
    lastDoots.push(doots);
    dp100 += doots-old;
  };

  var getDps = function() {
    return dp100/100;
  };

  var canAfford = function(item){
    return item.cost <= updoots;
  };

  var getPotentialDoots = function() {
    return ShopService.getItemCounts()[1];
  };

  var getPotentialComments = function(){
    return ShopService.getItemCounts()[2];
  };

  var dootPercent = function(post){
    var progress = (post.updoots+post.selfdooted)/(getPotentialDoots() + 1);
    return Math.round(progress*100);
  };

  var autoPosting = false;
  var timeToNextPost;

  var approxNormalRand =  function() {
    return (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 6;
  };

  var buy = function(item){
    if(canAfford(item)){
      updoots -= item.cost;
      ShopService.buy(item);

      //Set up autoposting on first buy of poster
      if(item.id == 3){
        if(!autoPosting) {
          timeToNextPost = 120000 * approxNormalRand() / ShopService.getItemCounts()[3];
          autoPost();
        }
      }
    }
  };

  var applyAutoPost = function() {
    $rootScope.$apply(autoPost);
  };

  var autoPost = function() {
    PostService.makePost();
    autoPosting = window.setTimeout(applyAutoPost, timeToNextPost);
  };

  if(ShopService.getItemCounts()[3] > 0) {
    autoPosting = true;
    timeToNextPost = 120000 * approxNormalRand() / ShopService.getItemCounts()[3];
    autoPost();
  }

  var tickCount = 0;

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
            updoots += commentDiff;
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
    $rootScope.$apply(tick);
  };

  var clock = setInterval(digestTick, 100);
  setInterval(StorageService.save, 5000);

  return {
    getDoots: getDoots,
    getDps: getDps,
    addDoots: addDoots,
    canAfford: canAfford,
    buy: buy,
    dootPercent: dootPercent
  }
});