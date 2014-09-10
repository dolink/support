"use strict";

var sh = require('shelljs');

var distributor = sh.echo('lsb_release -a | grep Distributor\\ ID');

console.log(distributor);