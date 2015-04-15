// предварительно выполнить команду npm install mysql
//для установки модуля mysql
var mysql = require('mysql');
var options = require('./db.ini');

function insertElevation(lat,lng,elevation,getResult){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    connection.query( 'USE ' + options.db_name );
    var sql = 'CALL insertElevation('+lat+','+lng+','+elevation+')';
    connection.query(sql, function(error, result, fields){
            if (error) { throw error; }
            getResult(result);
        });//end query
    connection.end()
}//end insertElevation

function insertElevationMulti(result, delta, getResult){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    connection.query( 'USE ' + options.db_name );
    var sql = 'DELETE FROM elevation WHERE ';
    for ( var i = 0; i < result.length; i++ )
    {
        sql += '(lat between '+ (result[i]['lat']-delta)+' and '+(result[i]['lat']+delta)+' and lng between '+(result[i]['lng']-delta)+' and '+(result[i]['lng']+delta)+')';
        if ( i < result.length-1 ) sql += ' OR ';
    }
    connection.query(sql, function(error, res, fields){
            if (error) { throw error; }
            //console.log('old dots was deleted');
            var sql2 = 'INSERT INTO elevation (lat,lng,elevation) VALUES ';
            for ( var i = 0; i < result.length; i++ )
            {
                sql2 += '('+result[i]['lat']+','+result[i]['lng']+','+result[i]['elevation']+')';
                if ( i < result.length-1 ) sql2 += ',';
            }
            console.log(JSON.stringify(result));
            connection.query(sql2, function(error, result, fields){
                if (error) { throw error; }
                //console.log('new dots was inserted');
                getResult(true);
            });
            connection.end()
        });//end query
    
}//end insertElevation


function getElevation(lat,lng,delta,getResult){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    connection.query( 'USE ' + options.db_name );
    var sql = 'CALL getElevation('+lat+', '+lng+', ' + delta+', @el )';
    connection.query(sql, function(error, result, fields){
            if (error) { throw error; }
            getResult(result);
        });//end query
    connection.end()
}//getElevation

function checkDots(dots,delta,getResult){
    var connection = mysql.createConnection(options.db_options);
    connection.connect();
    connection.query( 'USE ' + options.db_name );
    var sql = 'SELECT lat,lng,elevation FROM elevation WHERE ';
    for ( var i = 0; i < dots.length; i++ )
    {
        sql += '(lat between '+ (dots[i][0]-delta)+' and '+(dots[i][0]+delta)+' and lng between '+(dots[i][1]-delta)+' and '+(dots[i][1]+delta)+')';
        if ( i < dots.length-1 ) sql += ' OR ';
    }
   
    connection.query(sql, function(error, result, fields){
            if (error) { throw error; }
            getResult(result);
        });//end query
    connection.end()
}//checkDots

exports.insertElevation = insertElevation;
exports.getElevation = getElevation;
exports.checkDots = checkDots;
exports.insertElevationMulti = insertElevationMulti;
