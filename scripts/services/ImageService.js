/**
 * Created by Rory on 30/04/2016.
 */
angular.module('upDooter').service('ImageService', function($rootScope) {
    var imgur = window.imgur;
    var count = 0;

    return {
        getImage: function(post, tags) {
            var query = _.sample(tags);
            imgur.search(query).then(function(data) {
                if(data.length > 1){
                    var image = _.sample(data);
                    $rootScope.$apply(function(){
                        post.image = image.link;
                    });
                }else{
                    count ++;
                    $rootScope.$apply(function(){
                        post.image = 'http://lorempixel.com/500/380/?'+count;
                    });
                }
            });
        }
    };
});