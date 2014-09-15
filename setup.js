"use strict";

var sh = require('shelljs');
var ch = require('chalk');
var read = require('read');
var util = require('util');
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

// Setting the owner of global node_modules to user
sh.exec('chown -R ' + user + ' /usr/local/lib/node_modules/');

// setup support
sh.echo(ch.bold('Setup `support`'));

sh.echo('   Create the `support` Support Folder');
sh.rm('-fr', '/opt/support');
sh.mkdir('-p', '/opt/support');
//sh.exec('chown -R ' + user + ' /opt/support');

sh.echo('   Fetching the `support` repo from Github');
sh.exec('git clone https://github.com/dolink/support.git /opt/support ');
sh.cd('/opt/support');
sh.exec('git checkout master');

sh.echo("   Installing the `support` repo dependencies");
sh.exec('npm install');

// Set the permission of bins to executable
sh.echo("   Setting the permission of /opt/support/bin to executable");
var bins = sh.ls('/opt/support/bin');
bins.forEach(function (bin) {
    sh.echo("   chmod u+x " + bin);
    sh.chmod('u+x', bin);
});

// setup dmc
sh.echo(ch.bold('Setup `dmc`'));
sh.echo('   Create the `dmc` Directory');
sh.rm('-fr', '/opt/dmc');
sh.mkdir('-p', '/opt/dmc');
//sh.exec('chown -R ' + user + ' /opt/dmc');

sh.echo("   Fetching the `dmc` repo from Github");
sh.exec('git clone https://github.com/dolink/dmc.git /opt/dmc');
sh.cd('/opt/dmc');
sh.exec('git checkout master');

sh.echo("   Installing the `dmc` repo dependencies");
sh.exec('npm install');

// setup agent
sh.echo(ch.bold('Setup `agent`'));
sh.echo('   Create the `agent` Directory');
sh.rm('-fr', '/opt/agent');
sh.mkdir('-p', '/opt/agent');
//sh.exec('chown -R ' + user + ' /opt/agent');

sh.echo("   Fetching the `agent` repo from Github");
sh.exec('git clone https://github.com/dolink/agent.git /opt/agent');
sh.cd('/opt/agent');
sh.exec('git checkout master');

sh.echo("   Installing the `agent` repo dependencies");
sh.exec('bash ./bin/install.sh', {silent: false});

// Create directory /etc/agent
sh.echo(ch.bold("Adding /etc/agent"));
sh.mkdir('-p', '/etc/agent');

// chown opt folder
sh.echo(ch.bold('Set `' + user + '` user as the owner of this directory'));
sh.exec('chown -R ' + user + ' /opt/');

//var check = sh.grep('/opt/support/bin', '/root/.bashrc');

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