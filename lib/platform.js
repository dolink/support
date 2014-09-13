"use strict";

var sh = require('shelljs');

var products = {
    "debian": "pi",
    "ubuntu": "beagle"
};

var platform = module.exports = require('platform');

var distributor = sh.exec('lsb_release -a | grep Distributor\\ ID').output;
try {
    distributor = distributor.split(':')[1].trim().toLowerCase();
} catch (e) {
    console.error('Can not recognize OS Distributor: ' + distributor);
    throw e;
}

platform.product = platform.product || products[distributor];