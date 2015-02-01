var http = require('http');
var ELEVATION_SERVICE_HOSTNAME = '127.0.0.1'; /*хост сервиса высот*/
var ELEVATION_SERVICE_PORT = 8002; /*порт сервиса высот*/
var delta = 0.01;
var googleElevationService = require('./google.el.srv/el.srv');
var FAIL = -1000000;
var service = 'sqlite';

/**
* получение высот точек от севиса высотных данных
* и обновление в соответсвиис ними объектов юнитов
* в объекте игры game
* @param game объект игры
* @callback функция обратного вызова, вызываемая по завершении операции
**/
function updateElevation(game, callback){
    var dots = prepareDots(game);
    if ( service == 'google' ){
        googleElevationService.getElevations(dots, function(result){
            updateGameObject(game, result, callback);
        });   
    }else if ( service == 'sqlite' ){
        getElevations(dots, function(result){
            updateGameObject(game, result, callback);
        }); 
    }
}

/**
* подготовка массива с координатами юнитов игры
* @param game объект игры
**/
function prepareDots(game){
    var dots = [];
    var rNumber = game.regiments.length;
    var bNumber = game.bases.length;
    
    for (var i = 0; i < rNumber + bNumber; i++ ){
        dots.push([0,0]);
    }
    
    for ( var i = 0; i < rNumber; i++ ){
        if ( game.regiments[i] == undefined ) continue;
        dots[i][0] = game.regiments[i].latlng[0];
        dots[i][1] = game.regiments[i].latlng[1];
    }
    for ( var i = rNumber; i < rNumber + bNumber; i++ ){
        if ( game.bases[i] == undefined ) continue;
        dots[i][0] = game.bases[i-rNumber].latlng[0];
        dots[i][1] = game.bases[i-rNumber].latlng[1];
    }
    
    return dots;
}

/**
*обновление поля elevation у юнитов игры
* @param game объект игры
* @param result результат запроса к сервису высот
* @param callback функция обратного вызова, вызываемая по завершении операции
**/
function updateGameObject(game, result, callback){
    if ( result == undefined ) return false;
    for ( var i = 0; i < game.regiments.length; i++ ){
        if ( game.regiments[i] == undefined ) continue;
        var el = findNearest(game.regiments[i].latlng, result);
        if ( el != FAIL ) game.regiments[i].elevation = el;
    }
    for ( var i = 0; i < game.bases.length; i++ ){
        if ( game.bases[i] == undefined ) continue;
        var el = findNearest(game.bases[i].latlng, result);
        if ( el != FAIL ) game.bases[i].elevation = el;
    }
    callback();
}

/**
* нахождение квадрата расстояния между точками (без учета кривизны)
**/
function getSquareDist( x, y ){
	return ( (x[0]-y[0])*(x[0]-y[0]) + (x[1]-y[1])*(x[1]-y[1]) );
}

/**
* нахождение в массиве результатов результата ближайшего к заданной точке 
* @param dot точка, заданная кординатами [lat,lng]
* @param array массив объектов [{lat:lat,lng:lng,elevation:elevation}, ...]
**/
function findNearest( dot, array ){
    if ( array.length == 0 ) return FAIL;
    var el = array[0]['elevation'];
    var minDist = getSquareDist(dot, [array[0]['lat'], array[0]['lng']]);
    for ( var i = 0; i < array.length; i++ ){
        currDist = getSquareDist(dot, [array[i]['lat'], array[i]['lng']]);
        if ( currDist < minDist ){
            minDist = currDist;
            el = array[i]['elevation'];
        }
    }
    return el;
}

/**
* получение данных  через отправку HTTP POST запроса 
* @param dots массив точек своих баз вида [[lat1,lng1],[lat2,lng2],...]
* @param callback функция обратного вызова, в которую передается результата в 
* виде объекта массива объектов [{lat:lat,lng:lng,elevation:elevation}, ...]
**/
function getElevations( dots, callback ){
    var path = '/elevations';
    var params = 'data=' + JSON.stringify(dots);
    var results = '';
    var options = {
                        hostname: ELEVATION_SERVICE_HOSTNAME,
                        port: ELEVATION_SERVICE_PORT,
                        path: path,
                        method: 'POST',
                        headers: {'Content-type': 'application/x-www-form-urlencoded'}
                    };
            
    var req = http.request(options, function(res){
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    results += chunk;
                });
                res.on('end',function(){
                   var result = JSON.parse(results);
                   callback(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    // write data to request body
    req.write(params);
    req.end();
}

exports.updateElevation = updateElevation;