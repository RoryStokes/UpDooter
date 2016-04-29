/**
 * Created by Rory on 22/04/2016.
 */
angular.module('upDooter').service('ShopService', function(StorageService) {
    var _ = window._;

    var getItemCounts = function() {
        return itemCounts
    };

    var itemCounts = StorageService.bind('itemCounts', getItemCounts) || {};

    var items = {
        1: {
            name: 'Lurker',
            baseCost: 10
        },
        2: {
            name: 'Commenter',
            baseCost: 50
        },
        3: {
            name: 'Poster',
            baseCost: 1000
        }
    };

    var getCost = function(item, id){
        return Math.floor(item.baseCost*Math.pow(1.1,itemCounts[id]));
    };

    var getCount = function(id){
        var saved = itemCounts[id];
        if(saved){
            return saved
        }
        else {
            itemCounts[id] = 0;
            return 0;
        }
    };

    var generateShop = function () {
        return _.map(items, function(item, id) {
            return {
                id: id,
                name: item.name,
                count: getCount(id),
                cost: getCost(item, id)
            };
        })
    };

    var getShop = function() {
        return shop;
    };

    var shop = generateShop();

    var buy = function(item){
        items[item.id].count ++;
        itemCounts[item.id] ++;
        shop = generateShop();
    };


    return {
        getItemCounts: getItemCounts,
        getShop: getShop,
        getCost: getCost,
        buy: buy
    };
});