// предварительно выполнить команду npm install mysql
//для установки модуля mysql

//скрипт создания БД
var mysql = require('mysql');
var fs = require('fs');
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

function createDb(callbk){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    var sql = 'CREATE DATABASE ' + options.db_name;
    connection.query( sql, function(error, result, fields){
        if (error) { throw error; }
         console.log('Database was created');
         createTables(callbk);
        });
    connection.end();
}//end createDb

function createTables(callbk){
    fs.readFile(options.db_dump, {encoding:'utf8',flag:'r'}, function(err,data){
        if (err) {throw err;}
        var connection = mysql.createConnection(options.db_options);
        connection.connect();
        connection.query('USE ' + options.db_name );
        var sql = data.split(/\/\/endstr/);
        for (var i = 0; i < sql.length; i++ )
        {
            console.log(sql[i]);
            if (sql[i].length > 2 )
            {
                connection.query(sql[i], function(error, result, fields){
                if (error) { throw error; }
                console.log('query was executed');
                callbk();
                });//end query
            }//end if
        }//end for  
        connection.end();
    });
}//end createTables

isDbExists(function(exists){
    if(!exists) createDb(function(){});
});
