"use strict";

var sh = require('shelljs');
sh.config.silent = true;

var config = require('./config');

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

// clone setup
sh.echo('Create the Dolink Setup Folder'.bold);
sh.rm('-fr', '/opt/setup');
sh.mkdir('-p', '/opt/setup');

sh.echo('Fetching the Setup Repo from Github'.bold);
sh.exec('git clone https://github.com/dolink/setup.git /opt/setup ');
sh.cd('/opt/setup');
sh.exec('git checkout master');

// clone dobox
sh.echo('Create the Dobox Directory'.bold);
sh.rm('-fr', '/opt/dmc');
sh.mkdir('-p', '/opt/dmc');

sh.echo("Clone the DMC into opt".bold);
sh.exec('git clone https://github.com/dolink/dmc.git /opt/dmc');
sh.cd('/opt/dmc');
sh.exec('git checkout master');

// clone agent
sh.echo('Create the Agent Directory'.bold);
sh.rm('-fr', '/opt/agent');
sh.mkdir('-p', '/opt/agent');

sh.echo("Clone the Agent into opt".bold);
sh.exec('git clone https://github.com/dolink/agent.git /opt/agent');
sh.cd('/opt/agent');
sh.exec('git checkout master');

// Create directory /etc/{project}
sh.echo("Adding /etc/" + config.project);
sh.mkdir('-p', '/etc/' + config.project);

// chown opt folder
sh.echo(('Set ' + user + ' user as the owner of this directory').bold);
sh.exec('sudo chown -R ' + user + ' /opt/');

// Add /opt/setup/bin to root's path
sh.echo("Adding /opt/setup/bin to root's path".bold);
'export PATH=/opt/setup/bin:$PATH'.toEnd('/root/.bashrc');

// Add /opt/setup/bin to user's path
sh.echo("Adding /opt/setup/bin to ${username}'s path".bold);
'export PATH=/opt/setup/bin:$PATH'.toEnd('/home/' + user + '/.bashrc');

require('./scripts/' + distributor + '/install');