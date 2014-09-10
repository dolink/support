"use strict";

var sh = require('shelljs');

var user = sh.echo('$USER');

console.log(user);