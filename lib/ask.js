"use strict";

module.exports = ask;

function ask(question, format, callback) {
    if (typeof format === 'function') {
        callback = format;
        format = null;
    }
    var stdin = process.stdin;
    var stdout = process.stdout;
    stdin.resume();
    stdout.write(question);
    return stdin.once('data', function (data) {
        data = data.toString().trim();
        if (!format || format.test(data)) {
            return callback && callback(data);
        }
        stdout.write("It should match: " + format + "\n");
        ask(question, format, callback);
    });
}