/**
 * Created by Rory on 30/04/2016.
 */
angular.module('upDooter').service('ImageService', function(ImgurMap) {
    //var imgur = window.imgur;
    //var imageSearch = window.imageSearch;
    //var count = 0;
    var _ = window._;
    var random = window.random;
    var keyword_opts = {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true
    };

    var countIntersection = function(a, b){
        return _.intersection([a,b]).length;
    };

    var pickImage = function(tags){
        var keywords = [];
        tags.forEach(function(tag){
            keywords = keywords.concat(window.keyword.extract(tag, keyword_opts));
        });
        var source = _.pick(ImgurMap, keywords);
        if(_.isEmpty(source)){
            source = ImgurMap;
        }
        return _.chain(source)
            .flatMap()
            .sample()
            .value()
    };

    return {
        getImage: function(post, tags) {
            post.image = 'http://i.imgur.com/' + pickImage(tags) + 'l.png';
        }
    };
});