'use strict';

angular.module('upDooter').controller('PostDetails', function($scope, $routeParams) {
    var encryptor = window.encryptor;
    var details = $routeParams.postDetails.split('-');
    var text = encryptor.decrypt(details[0]);
    var image =  encryptor.decrypt(details[1]);

    $scope.share = function() {
        FB.ui({
            method: 'feed',
            link: 'http://rorystokes.github.io/UpDooter/#/' + $routeParams.postDetails,
            caption: text,
            image: image,
            display: 'dialog'
        }, function(response){ console.log(response) });
        console.log('shared');
    };
    $scope.post = {
        text: text,
        image: image
    };
});