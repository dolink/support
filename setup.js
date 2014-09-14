"use strict";

var sh = require('shelljs');
var read = require('read');
var platform = require('./lib/platform');
var utils = require('./lib/utils');

require('colors');

sh.config.silent = true;

sh.echo('Detecting current user'.bold);
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

// Create directory /etc/agent
sh.echo("Adding /etc/agent".bold);
sh.mkdir('-p', '/etc/agent');

// chown opt folder
sh.echo(('Set ' + user + ' user as the owner of this directory').bold);
sh.exec('chown -R ' + user + ' /opt/');

var vars = 'export PATH=/opt/setup/bin:/opt/setup/bin/' + platform + ':$PATH\n';
// Add /opt/setup/bin to root's path
sh.echo("Adding /opt/setup/bin to root's path".bold);
(vars).toEnd('/root/.bashrc');

// Add /opt/setup/bin to user's path
sh.echo(("Adding /opt/setup/bin to " + user + "'s path").bold);
(vars).toEnd('/home/' + user + '/.bashrc');

// Set the box's environment
sh.echo("Setting the box's environment to stable".bold);
('export AGENT_ENV=stable\n').toEnd('/home/' + user + '/.bashrc');

sh.echo("Generating serial number from system".bold);
sh.exec("node /opt/setup/bin/"+ platform +"/sn");
require('./bin/gensn');

('platform="' + platform + '"\n').toEnd('/etc/environment.local');

sh.echo("Setup Successful!".green);

sh.echo("Before you reboot, write down this serial -- this is what you will need to activate your new Pi!".bold);

var serial = sh.cat('/etc/agent/serial.conf').trim();
utils.brand("Your Pi Serial is: `" + serial + "`");

read({ prompt: 'When you are ready, please hit the [Enter] key'.bold });