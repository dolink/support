"use strict";

var common = require('shelljs/src/common');
var util = require('util');
var fs = require('fs');

var sh = module.exports = require('shelljs');

function ShellString (value) {
    String.call(this, value);
}

util.inherits(ShellString, String);

ShellString.prototype.append = function (file) {
    if (!file)
        common.error('wrong arguments');

    if (!fs.existsSync( path.dirname(file) ))
        common.error('no such file or directory: ' + path.dirname(file));

    try {
        if (!fs.existsSync(file)) {
            fs.appendFileSync(file, this.toString(), 'utf8');
        } else {
            fs.writeFileSync(file, this.toString(), 'utf8');
        }

    } catch(e) {
        common.error('could not write to file (code '+e.code+'): '+file, true);
    }
};

sh.echo = function () {
    var messages = [].slice.call(arguments, 0);
    console.log.apply(this, messages);
    return new ShellString(messages.join(' '));
};