"use strict";

var sh = require('shelljs');

var platforms = {
    "debian": "pi",
    "ubuntu": "beagle"
};

exports.detect = function () {
    var distributor = sh.exec('lsb_release -a | grep Distributor\\ ID').output;
    try {
        distributor = distributor.split(':')[1].trim().toLowerCase();

    } catch (e) {
        console.error('Can not recognize OS Distributor: ' + distributor);
        throw e;
    }

    if (platforms[distributor]) return platforms[distributor];
    throw new Error('Unknown platform for distributor "'+ distributor +'"');
};