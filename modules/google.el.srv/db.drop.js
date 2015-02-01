// предварительно выполнить команду npm install mysql
//для установки модуля mysql

//скрипт удаления БД
var mysql = require('mysql');
var options = require('./db.ini');

function isDbExists(callbk){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    var sql = 'SHOW databases';
    connection.query( sql, function(error, result, fields){
        if (error) { throw error; }
        var dbExists = false;
        for ( var i = 0; i < result.length; i++ ){
            if ( result[i]['Database'] == options.db_name ) dbExists = true;
        };
        callbk(dbExists);
     });
    connection.end();
}//end isDbExists

function dropDb(callbk){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    var sql = 'DROP DATABASE ' + options.db_name;
    connection.query( sql, function(error, result, fields){
        if (error) { throw error; }
         console.log('Database was drop');
        });
    connection.end();
}//end dropDb

isDbExists(function(exists){
    if(exists) dropDb(function(){});
});
