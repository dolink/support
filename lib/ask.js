"use strict";

var read = require('read');

module.exports = ask;

function ask(question, format, callback) {
    if (typeof format === 'function') {
        callback = format;
        format = null;
    }
    callback = callback || function () {};
    read({
        prompt: question,
        timeout: 60000
    }, callback);
}