/*модуль получения высотных данных от сервиса Google*/
var http = require('http');
var DOT_LIMIT = 512; //ограничение на количетво точек в запросе
var URL_LENGTH_LIMIT = 2048; // ограничение на длину URL запроса

/**
* получение высоты по одной точке
* @param lat, lng координаты точки
* @param getResult функция обратного вызова в которую передается результат
* в виде объекта, формат котрого определен в документации Google
**/
function getElevationDot( lat, lng, getResult ){
    
    var options = {
                hostname: 'maps.googleapis.com',
                port: 80,
                path: '/maps/api/elevation/json?sensor=false&locations='+lat+','+lng,
                method: 'GET'
               };
                
    var req = http.request(options, function(res){
        console.log('send request to google...');
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var results = JSON.parse(chunk);
                    getResult(results);
                });
        }
        else{
                res.on('data', function (chunk) {
                    getResult(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    req.end();
}//end getEvevationDot

/**
* получение высоты по нескольким точкам
* @param dots массив точек вида [[lat1,lng1],[lat2,lng2],...]
* @param getResult функция обратного вызова в которую передается результат
* в виде объекта, формат котрого определен в документации Google
**/
function getElevationDots( dots, getResult ){
    
    var path = '/maps/api/elevation/json?sensor=false&locations=';
    var locations = '';
    var results = '';
    for ( var i = 0; i < dots.length && i < DOT_LIMIT; i++ ){
        if ( ( path + locations + dots[i][0] + ',' + dots[i][1] ).length >= URL_LENGTH_LIMIT) {
            locations = locations.slice(0,locations.length-1);
            break;
            }
         
        locations += dots[i][0] + ',' + dots[i][1];
        if ( i < dots.length - 1 ) locations += '|';    
    }
    
    //console.log('locations: '+locations);
    //console.log('len: '+ locations.length);
    var options = {
                hostname: 'maps.googleapis.com',
                port: 80,
                path: path+locations,
                method: 'GET'
               };
            
    var req = http.request(options, function(res){
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    results += chunk;
                });
                res.on('end',function(){
                   result = JSON.parse(results);
                   getResult(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log(chunk);
                    getResult(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    req.end();
}//end getEvevationDots


/**
* получение высоты по пути заданному несколькими точками
* @param dots массив точек вида [[lat1,lng1],[lat2,lng2],...]
* @param samples 
* @param getResult функция обратного вызова в которую передается результат
* в виде объекта, формат котрого определен в документации Google
**/
function getElevationPath( dots, samples, getResult ){
    
    var path = '';
    for ( var i = 0; i < dots.length; i++ ){
        path += dots[i][0] + ',' + dots[i][1];
        if ( i < dots.length - 1 ) path += '|';    
    }
    
    var options = {
                hostname: 'maps.googleapis.com',
                port: 80,
                path: '/maps/api/elevation/json?sensor=false&samples='+samples+'&path='+path,
                method: 'GET'
               };
               
    var req = http.request(options, function(res){
        var elevation = undefined;
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var results = JSON.parse(chunk);
                    getResult(results);
                });
        }
        else{
                res.on('data', function (chunk) {
                    getResult(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    req.end();
}//end getEvevationPath

exports.getElevationDot = getElevationDot;
exports.getElevationDots = getElevationDots;
exports.getElevationPath = getElevationPath;

