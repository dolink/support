"use strict";

var sh = require('shelljs');
var ch = require('chalk');
var read = require('read');
var platform = require('./lib/platform');
var utils = require('./lib/utils');

sh.config.silent = true;

sh.echo(ch.bold('Detecting current user'));
var user = sh.exec('users').output;
try {
    user = user.split('\t\r\n')[0].trim();
} catch (e) {
    console.error('Can not find the proper user from: ' + user);
    process.exit(1);
}

// clone support
sh.echo(ch.bold('Create the Dolink Support Folder'));
sh.rm('-fr', '/opt/support');
sh.mkdir('-p', '/opt/support');

sh.echo(ch.bold('Fetching the Support Repo from Github'));
sh.exec('git clone https://github.com/dolink/support.git /opt/support ');
sh.cd('/opt/support');
sh.exec('git checkout master');

// clone dobox
sh.echo(ch.bold('Create the Dobox Directory'));
sh.rm('-fr', '/opt/dmc');
sh.mkdir('-p', '/opt/dmc');

sh.echo(ch.bold("Clone the DMC into opt"));
sh.exec('git clone https://github.com/dolink/dmc.git /opt/dmc');
sh.cd('/opt/dmc');
sh.exec('git checkout master');

// clone agent
sh.echo(ch.bold('Create the Agent Directory'));
sh.rm('-fr', '/opt/agent');
sh.mkdir('-p', '/opt/agent');

sh.echo(ch.bold("Clone the Agent into opt"));
sh.exec('git clone https://github.com/dolink/agent.git /opt/agent');
sh.cd('/opt/agent');
sh.exec('git checkout master');

// Create directory /etc/agent
sh.echo(ch.bold("Adding /etc/agent"));
sh.mkdir('-p', '/etc/agent');

// Set the permission of bins to executable
sh.echo(ch.bold("Setting the permission of /opt/support/bin to executable"));
var bins = sh.ls('/opt/support/bin');
bins.forEach(function (bin) {
    sh.echo("   chmod u+x " + bin);
    sh.chmod('u+x', bin);
});

// chown opt folder
sh.echo(ch.bold('Set `' + user + '` user as the owner of this directory'));
sh.exec('chown -R ' + user + ' /opt/');

var env = 'export PATH=/opt/support/bin:$PATH\n';
// Add /opt/support/bin to root's path
sh.echo(ch.bold("Adding /opt/support/bin to root's path"));
env.toEnd('/root/.bashrc');

// Add /opt/support/bin to user's path
sh.echo(ch.bold("Adding /opt/support/bin to " + user + "'s path"));
env.toEnd('/home/' + user + '/.bashrc');

// Set the box's environment
sh.echo(ch.bold("Setting the box's environment to stable"));
('export AGENT_ENV=stable\n').toEnd('/home/' + user + '/.bashrc');

sh.echo(ch.bold("Generating serial number from system"));
sh.exec("node /opt/support/bin/"+ platform +"/sn");
require('./bin/gensn');

('platform="' + platform + '"\n').toEnd('/etc/environment.local');

sh.echo(ch.bold("Before you reboot, write down this serial -- this is what you will need to activate your new Pi!"));

var serial = sh.cat('/etc/agent/serial.conf').trim();
utils.brand("Your Pi Serial is: `" + serial + "`");

read({ prompt: ch.bold('When you are ready, please hit the [Enter] key') }, function () {});