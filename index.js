
/*
 * modified by kaiye
 * from fis-command-xgettext
 */

'use strict';
var i18n_entries = [],
    i18n_map = {};

exports.name = 'xgettext';
exports.usage = '<command> [options]';
exports.desc = 'xgettext';
exports.register = function(commander) {
    var root, conf, filename = 'fis-conf.js';
    i18n_entries = [];

    root = fis.util.realpath(process.cwd());
    if(!conf){

        var cwd = root, pos = cwd.length;
        do {
            cwd  = cwd.substring(0, pos);
            conf = cwd + '/' + filename;
            if(fis.util.exists(conf)){
                root = cwd;
                break;
            } else {
                conf = false;
                pos = cwd.lastIndexOf('/');
            }
        } while(pos > 0);
    }

    if (!conf) {
        return;
    }

    fis.project.setProjectRoot(root);

    require(conf); 
    
    var files = fis.project.getSource();
    
    fis.util.map(files, function (subpath, file) {
        if (file.isHtmlLike || file.isJsLike) {
            parse(file.getContent(), file);
        }
    });

    var lang = fis.config.get('lang').toLowerCase() || 'message',
        filepath = root + '/lang/'+ lang + '.po',
        isAppend = fis.util.exists(filepath),
        po_content = isAppend ? '' : 'msgid ""\nmsgstr ""\n"Content-Type: text/plain; charset=UTF-8"\n\n',
        old_po_content = isAppend ? fis.util.read(filepath) : '';


    for (var i = 0, len = i18n_entries.length; i < len; i++) {
        var entry = i18n_entries[i],
            msgid = entry.replace('"', '\"');
        if(isAppend){
            if(~old_po_content.indexOf(msgid)){
                continue;
            }
        }
        po_content += 'msgid "'+ msgid + '"\n';
        po_content += 'msgstr ""\n';
        po_content += '\n\n';
    }

    fis.util.write(filepath, po_content, 'utf-8', isAppend);
};

function parse(content, file) {
    var reg;
    if (file.isJsLike) {
        reg = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(\/\/[^\r\n\f]+|\/\*[\s\S]*?(?:\*\/|$))|\b(__)\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\)/g; 
        content.replace(reg, function(m, comment, type, value) {
            if (value) {
                var info = fis.util.stringQuote(value);
                if(i18n_map[info.rest] === undefined){
                    i18n_entries.push(info.rest);
                    i18n_map[info.rest] = '';
                }
            }
            return m;
        });
    } else if (file.isHtmlLike) {
        reg = /\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\|\s*gettext/g 
        content.replace(reg, function(m, value) {
            if (value) {
                var info = fis.util.stringQuote(value);
                if(i18n_map[info.rest] === undefined){
                    i18n_entries.push(info.rest);
                    i18n_map[info.rest] = '';
                }
            }
            return m;
        });
    }
}
