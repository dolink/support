"use strict";

var sh = require('shelljs');

var distributor = sh.exec('lsb_release -a | grep Distributor\\ ID').output;
try {
    distributor = distributor.split(':')[1].trim().toLowerCase();
} catch (e) {
    console.error('Can not recognize OS Distributor: ' + distributor);
    process.exit(1);
}

var user = sh.exec('users').output;
console.log(user);

require('./scripts/' + distributor + '/install');