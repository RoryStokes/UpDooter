/**
 * Created by Rory on 20/04/2016.
 */
angular.module('upDooter').service('StorageService', function(localStorageService) {
    var binds = {};
    var _ = window._;
    //var store = window.store;

    return {
        bind: function(key, fn){
            binds[key] = fn;
            return localStorageService.get(key);
        },
        save: function() {
            _.forIn(binds, function(value, key) {
                localStorageService.set(key, value());
            });
            console.log("SAVED");
        }
    }
});