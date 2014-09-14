"use strict";

var fs = require('fs');

var platform = 'Unknown';

if (fs.existsSync('/dev/ttyAMA0')) {
    platform = 'pi';
} else if (fs.existsSync('/dev/ttyO1')) {
    platform = 'beagle'
}

module.exports = platform;