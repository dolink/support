"use strict";

var sh = require('shelljs');
var config = require('shelljs').config;
config.silent = true;

require('colors');

console.log('Detecting the OS Distributor'.bold);
var distributor = sh.exec('lsb_release -a | grep Distributor\\ ID').output;
try {
    distributor = distributor.split(':')[1].trim().toLowerCase();
} catch (e) {
    console.error('Can not recognize OS Distributor: ' + distributor);
    process.exit(1);
}

console.log('Detecting the user'.bold);
var user = sh.exec('users').output;
try {
    user = user.split('\t\r\n')[0].trim();
} catch (e) {
    console.error('Can not find the proper user from: ' + user);
    process.exit(1);
}

console.log('Create the Dolink Setup Folder'.bold);
sh.rm('-fr', '/opt/setup');
sh.mkdir('-p', '/opt/setup');

console.log('Fetching the Setup Repo from Github'.bold);
sh.exec('git clone https://github.com/dolink/setup.git /opt/setup ');
sh.cd('/opt/setup');
sh.exec('git checkout master');

console.log(('Set ' + user + ' user as the owner of this directory').bold);
sh.exec('sudo chown -R ' + user + ' /opt/');

require('./scripts/' + distributor + '/install');