#!/usr/bin/env node

var sh = require('shelljs');
var parser = require('properties-parser');

module.exports = function () {
    // sudo grep Serial /proc/cpuinfo | cut -d: -f 2 | tr -d ' ' |  tr '[:lower:]' '[:upper:]' > /etc/agent/serial.conf
    var props = parser.parse(sh.cat('/proc/cpuinfo'));
    var serial = props['Serial'];
    return serial && serial.toUpperCase();
};