'use strict';

window.angular = require('angular');
window._ = require('lodash');
window.Sentencer = require('sentencer');
require('angular-local-storage');
var Imgur = require('imgur-search');
window.imgur = new Imgur('6578cfd2e2003ee');
window.random = require('random-distrib.js');
//window.store = require('store');
angular.module('upDooter',['LocalStorageModule']);