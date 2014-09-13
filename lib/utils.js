"use strict";

exports.brand = function (content, indent) {
    if (indent === null || indent === undefined) indent = 8;
    var len = content.length + indent * 2;

    var str = print('-', len + 2) + '\n';
    str = str + '|' + print(' ', len) + '|\n';
    str = str + '|' + print(' ', indent) + content + print(' ', indent) + '|\n';
    str = str + '|' + print(' ', len) + '|\n';
    str = str + print('-', len + 2) + '\n';
    console.log(str);
};

function print(ch, num) {
    if (!num) num = 1;
    var str = '';
    for (var i = 0; i < num; i++) {
        str += ch;
    }
    return str;
}