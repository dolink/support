"use strict";

var platform = require('../platform');

var path = require('path');
function script(name) {
    return require(path.join(__dirname, platform, name));
}

exports.sn = script('sn');