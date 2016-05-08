'use strict';

angular.module('upDooter').controller('test', function($scope, ImgurMap) {
    var _ = window._;
    var clientID = '6578cfd2e2003ee';

    var request = window.request;
    var keyword = window.keyword;
    var keyword_opts = {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true
    };

    var data = _.mapValues(ImgurMap, function(array){
        return new Set(array);
    });

    window.getData = function() {
        return _.mapValues(data, function(set){
            return Array.from(set);
        });
    };

    console.log('window.getData()');

    var nom = function(gallery) {
        _.times(10, function(page){
            fetchPage(gallery, page);
        })
    };

    var fetchPage = function(gallery, page) {
        var options = {
            url: 'https://api.imgur.com/3/gallery' + gallery + '/top/' + page,
            headers: {
                'Authorization': 'Client-ID ' + clientID
            }
        };

        request.get(options, function(error, req, body){
            if(body) {
                _.forEach(JSON.parse(body).data, function(image){
                    var tags = keyword.extract(image.title + ' ' + (image.description || ""),keyword_opts);
                    var lastSlash = image.link.lastIndexOf("/");
                    var lastDot = image.link.lastIndexOf(".");
                    if(lastSlash < lastDot) {
                        var slug = image.link.substring(lastSlash+1, lastDot);
                        _.forEach(tags, function(tag){
                            if(data[tag]){
                                data[tag].add(slug);
                            }else{
                                data[tag] = new Set([slug])
                            }
                        })
                    }
                })
            }
        })

    };

    window.fetchPage = fetchPage;
    window.nom = nom
});