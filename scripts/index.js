"use strict";

var p = require('../lib/platform').product;

var path = require('path');
function plmod(name) {
    return require(path.join(__dirname, p, name));
}

exports.sn = plmod('sn');