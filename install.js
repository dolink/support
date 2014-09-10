"use strict";

var sh = require('shelljs');

var distributor = sh.exec('lsb_release -a | grep Distributor\\ ID');

console.log(distributor);