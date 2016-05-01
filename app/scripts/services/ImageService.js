/**
 * Created by Rory on 30/04/2016.
 */
angular.module('upDooter').service('ImageService', function($rootScope) {
    var imgur = window.imgur;
    var imageSearch = window.imageSearch;
    var count = 0;
    
    

    return {
        getImage: function(post, tags) {
            count ++;
            //post.image = 'http://lorempixel.com/500/380/?'+count;
            var query = tags.join(' ');
            imageSearch(query, function(err, data) {
                console.log(err);

                if(data){
                    var image = _.sample(data);
                    $rootScope.$apply(function(){
                        post.image = image.url;
                    });
                }
            });
        }
    };
});