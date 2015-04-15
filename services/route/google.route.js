var http = require('http');

var DOT_LIMIT = 8; //ограничение на количетво точек в запросе
var URL_LENGTH_LIMIT = 2048; // ограничение на длину URL запроса

/**
* получение маршрута с сервиса маршрутов Google
* в виде массива точек [[lat1,lng1],[lat2,lng2],...]
* @param source исходная точка
* @param target конечная точка
* @param waypoints массив путевых точек
* @param callback функция обратного вызова в которую передается маршрут 
**/
function getRoute( source, target, waypoints, callback  ){
    var results = '';
    var path = '/maps/api/directions/json?sensor=false&';
    path += 'origin='+source[0]+','+source[1]+'&';
    path += 'destination='+target[0]+','+target[1];
    var way = '';
    if ( waypoints.length != 0 ){
        way = '&waypoints=';
        for ( var i = 0; i < waypoints.length && i < DOT_LIMIT; i++ ){
            if ( ( path + way + waypoints[i][0] + ',' + waipoints[i][1] ).length < URL_LENGTH_LIMIT) {
                if ( i != 0 ){
                    way += '|' + waypoints[i][0] + ',' + waipoints[i][1];
                }else{
                    way += waypoints[i][0] + ',' + waipoints[i][1];
                }
                
            }else{
                break;   
            }
                
        }//end for
    }//end if

    
    var options = {
                hostname: 'maps.googleapis.com',
                port: 80,
                path: path+way,
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
                   callback(result); 
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
        console.log('problem with request: ' + e.message);
    });
    
    req.end();
}//end getEvevationDots


exports.getRoute = getRoute;
