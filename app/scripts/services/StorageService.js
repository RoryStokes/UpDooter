/**
 * Created by Rory on 20/04/2016.
 */
angular.module('upDooter').service('StorageService', function() {
    var binds = {};
    var _ = window._;
    var store = window.store;

    return {
        bind: function(key, fn){
            binds[key] = fn;
            return store.get(key);
        },
        save: function() {
            _.forIn(binds, function(value, key) {
                store.set(key, value());
            });
            console.log("SAVED");
        }
    }
});