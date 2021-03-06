/**
 * Created by Rory on 16/04/2016.
 */
angular.module('upDooter').service('PostService', function(MemeMachine, ImageService, StorageService) {
    var getPosts = function() {
        return window._.uniq(posts);
    };

    var posts =  StorageService.bind('posts', getPosts) || [];
    var maxPosts = 10;

    function newPost(meme) {
        return {
            text: meme.text,
            image: meme.image,
            selfdooted: false,
            updoots: 0,
            progress: 0,
            commentCount: 0,
            commentRand: Math.random(),
            commentDoots: 0,
            comments: []
        };
    }

    return {
        makePost: function () {
            var meme = MemeMachine.getPost();
            var post = newPost(meme);
            ImageService.getImage(post, meme.tags);
            posts.unshift(post);
            if (posts.length > maxPosts) {
                posts.pop();
            }
        },
        getPosts: getPosts
    };
});