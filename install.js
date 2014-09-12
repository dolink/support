"use strict";

var sh = require('shelljs');
var config = require('shelljs').config;
config.silent = true;

require('colors');

sh.echo('Detecting the OS Distributor'.bold);
var distributor = sh.exec('lsb_release -a | grep Distributor\\ ID').output;
try {
    distributor = distributor.split(':')[1].trim().toLowerCase();
} catch (e) {
    console.error('Can not recognize OS Distributor: ' + distributor);
    process.exit(1);
}

sh.echo('Detecting the user'.bold);
var user = sh.exec('users').output;
try {
    user = user.split('\t\r\n')[0].trim();
} catch (e) {
    console.error('Can not find the proper user from: ' + user);
    process.exit(1);
}

// clon setup
sh.echo('Create the Dolink Setup Folder'.bold);
sh.rm('-fr', '/opt/setup');
sh.mkdir('-p', '/opt/setup');

sh.echo('Fetching the Setup Repo from Github'.bold);
sh.exec('git clone https://github.com/dolink/setup.git /opt/setup ');
sh.cd('/opt/setup');
sh.exec('git checkout master');

// clone dobox
sh.echo('Create the Dobox Directory'.bold);
sh.rm('-fr', '/opt/dobox');
sh.mkdir('-p', '/opt/dobox');

sh.echo("Clone the Dobox into opt".bold);
sh.exec('git clone https://github.com/dolink/dobox.git /opt/dobox');
sh.cd('/opt/dobox');
sh.exec('git checkout master');

// clone agent
sh.echo('Create the Agent Directory'.bold);
sh.rm('-fr', '/opt/agent');
sh.mkdir('-p', '/opt/agent');

sh.echo("Clone the Agent into opt".bold);
sh.exec('git clone https://github.com/dolink/agent.git /opt/agent');
sh.cd('/opt/agent');
sh.exec('git checkout master');

// chown opt folder
sh.echo(('Set ' + user + ' user as the owner of this directory').bold);
sh.exec('sudo chown -R ' + user + ' /opt/');

require('./scripts/' + distributor + '/install');