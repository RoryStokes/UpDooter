angular.module('upDooter').config(function($routeProvider) {
    $routeProvider.
    when('/post/:postDetails', {
        templateUrl: 'postDetails.html',
        controller: 'PostDetails'
    }).
    otherwise({
        templateUrl: 'feed.html',
        controller: 'Feed'
    });
})
  .value('Settings', {images: true});