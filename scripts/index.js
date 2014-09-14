"use strict";

var p = require('../lib/platform').product;

var path = require('path');
function script(name) {
    return require(path.join(__dirname, p, name));
}

exports.sn = script('sn');