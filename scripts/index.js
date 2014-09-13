"use strict";

var _ = require('lodash');
var needs = require('needs');
var path = require('path');
var platform = require('platforms').detect();

//_.assign(exports, needs(path.join(__dirname, platform)));
exports.sn = require(platform + '/sn');