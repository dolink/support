#!/usr/bin/env node

var sh = require('shelljs');

module.exports = function () {
    // sudo grep Serial /proc/cpuinfo | cut -d: -f 2 | tr -d ' ' |  tr '[:lower:]' '[:upper:]' > /etc/agent/serial.conf
    var serial = sh.exec('grep Serial /proc/cpuinfo').output;
    serial.split(':')[1].trim().toLowerCase().to('/etc/agent/serial.conf');
};
