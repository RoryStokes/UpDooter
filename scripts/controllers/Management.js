'use strict';

angular.module('upDooter').controller('Management', function($scope, ShopService, Game) {
    $scope.getDoots = Game.getDoots;
    $scope.getShop = ShopService.getShop;
    $scope.getDps = Game.getDps;
    $scope.canAfford = Game.canAfford;
    $scope.buy = Game.buy;
});