'use strict';

angular.module('upDooter').controller('Feed', function($scope, $routeParams, PostService, ShopService, StorageService, Game, Settings) {
    var _ = window._;
    var encryptor = window.encryptor;
    var random = window.random;
    $scope.settings = Settings;
        
    $scope.getPosts = PostService.getPosts;
    
    $scope.getUrl = function(post) {
        return '#/post/'+
            encryptor.encrypt(post.text)+
            '-'+
            encryptor.encrypt(post.image);
    };

    $scope.dootPercent = Game.dootPercent;

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

});