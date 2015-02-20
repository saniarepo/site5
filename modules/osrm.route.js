var http = require('http');

var DOT_LIMIT = 25; //ограничение на количетво точек в запросе
var URL_LENGTH_LIMIT = 2048; // ограничение на длину URL запроса
var HOSTNAME = '192.168.0.115'; //адрес сервера маршрутов
var PORT = 5000; //порт сервера маршрутов

/**
* Декодирование геометрии маршрута из строки в массив точек
* вида [[lat1,lng1],[lat2,lng2],...]
* @param encoded строка с закодированной геометрией маршрута
* @precision точность
* @return array массив точек маршрута
**/
function decode(encoded, precision) {
    precision = Math.pow(10, -precision);
    if (!encoded) return [];
    var len = encoded.length, index=0, lat=0, lng = 0, array = [];
    while (index < len) {
        var b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        //array.push( {lat: lat * precision, lng: lng * precision} );
        array.push( [lat * precision, lng * precision] );
    }
    return array;
}

/**
* получение маршрута с сервиса OSRM
* в виде массива точек [[lat1,lng1],[lat2,lng2],...]
* @param source исходная точка
* @param target конечная точка
* @param waypoints массив путевых точек
* @param callback функция обратного вызова в которую передается маршрут 
**/
function getRoute( source, target, waypoints, callback  ){
    var results = '';
    var path = '/viaroute?';
    var start = 'loc='+source[0]+','+source[1]+'&';
    var end = 'loc='+target[0]+','+target[1];
    var way = '';
    if ( waypoints.length != 0 ){
        way = '';
        for ( var i = 0; i < waypoints.length && i < DOT_LIMIT; i++ ){
            if ( ( path + start + 'loc=' + waypoints[i][0] + ',' + waipoints[i][1] + end ).length < URL_LENGTH_LIMIT) {
                if ( i < waypoints.length - 1 ){
                    way += 'loc=' + waypoints[i][0] + ',' + waipoints[i][1]+'&';
                }else{
                    way +=  'loc=' + waypoints[i][0] + ',' + waipoints[i][1];
                }
                
            }else{
                break;   
            }
                
        }//end for
    }//end if
    path += start + way + end;
    
    var options = {
                hostname: HOSTNAME,
                port: PORT,
                path: path,
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
                   callback(decode(result.route_geometry,6)); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log(chunk);
                    callback(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('osrm.route: problem with request: ' + e.message);
    });
    
    req.end();
}//end getRoute

exports.getRoute = getRoute;
