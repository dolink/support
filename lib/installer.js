"use strict";

var fs = require('fs');
var path = require('path');
var sh = require('shelljs');
var ch = require('chalk');

module.exports = Installer;

function Installer(config) {
    if (typeof config === 'string') {
        config = {root: config};
    }
    config = config || {};
    this.root = config.root || '/opt';
    this.gitbase = config.gitbase || 'https://github.com/dolink';
    this.silent = ('silent' in config) ? config.silent : sh.config.silent;
    this.execOpts = {silent: this.silent};
}

Installer.prototype.install = function (mod) {
    sh.echo(ch.bold('Installing `' + mod + '`'));
    var local = path.join(this.root, mod);
    if (fs.existsSync(local)) {
        this._update(mod);
    } else {
        this._install(mod);
    }
};

Installer.prototype._update = function (mod) {
    var local = path.join(this.root, mod);
    sh.cd(local);

    sh.echo('   Updating the `' + mod + '` repo');
    sh.exec('git pull', this.execOpts);

    sh.echo('   Updating the `' + mod + '` dependencies');
    var script = path.join(local, 'bin', 'update.sh');
    if (fs.existsSync(script)) {
        sh.exec('bash ' + script, this.execOpts);
    } else {
        sh.exec('npm update', this.execOpts);
    }
};

Installer.prototype._install = function (mod) {
    var local = path.join(this.root, mod);
    var url = this.gitbase + '/' + mod + '.git';
    sh.mkdir(local);

    sh.echo('   Fetching the `' + mod + '` repo to ' + local + ' from ' + url);
    sh.exec('git clone ' + url + ' ' + local, this.execOpts);
    sh.cd(local);
    sh.exec('git checkout master', this.execOpts);

    sh.echo('   Installing the `' + mod + '` dependencies');
    var script = path.join(local, 'bin', 'install.sh');
    if (fs.existsSync(script)) {
        sh.exec('bash ' + script, this.execOpts);
    } else {
        sh.exec('npm install', this.execOpts);
    }
};