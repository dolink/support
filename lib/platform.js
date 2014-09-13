"use strict";

var platform = require('platform');

var adaptors = {
    "debian": "pi",
    "ubuntu": "beagle"
};

module.exports = platform;