/*модуль для удобства отладки*/
var fs = require("fs");
var helper = require('./helper');
var logfile = './log.txt';

/**
* запись лога в файд
* @param msg сообщение
**/
function log(msg){
    var time = helper.getTime();
    filename = logfile;
    fs.appendFile(filename,time+': '+msg+"\n",function(err){
        if(err) throw err;
    });
}

exports.log = log;
