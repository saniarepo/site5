/*модуль определения окружения полков*/
var Debug = require('./debug');
var http = require('http');
var ROUTE_SERVICE_HOSTNAME = '127.0.0.1'; /*хост сервиса маршрутов*/
var ROUTE_SERVICE_PORT = 8001; /*порт сервиса расчета окружения*/
var unitsPositionsHash = 0; /*хеш позиций юнитов*/

/**
* получение хеша из позиций юнитов с целью определения 
* было ли движение юнитов или нет
* @param game объект игры
* @return hash хеш от положений юнитов
**/
function calcUnitsPositionsHash(game){
    var hash = 0;
    for (var i = 0; i < game.regiments.length; i++){
        hash += game.regiments[i].latlng[0] + game.regiments[i].latlng[1];
    }
    for (var i = 0; i < game.bases.length; i++){
        hash += game.bases[i].latlng[0] + game.bases[i].latlng[1];
    }
    return hash;
}

/**
* массива объектов полков для отправки на сервер для расчета окружения
* @param game объект игры
* @return regiments массив объектов полков
**/
function getRegimentsData(game){
    var regiments = [];
    var item = null;
    for ( var i = 0; i < game.regiments.length; i++ ){
        item = game.regiments[i];
        regiments.push({id:item.id, country:item.country.id,lat:item.latlng[0],lng:item.latlng[1],radius:item.type.radius});
    }
    return regiments;
}

/**
* массива объектов баз для отправки на сервер для расчета окружения
* @param game объект игры
* @return bases массив объектов баз
**/
function getBasesData(game){
    var bases = [];
    var item = null;
    for ( var i = 0; i < game.bases.length; i++ ){
        item = game.bases[i];
        bases.push({id:item.id, country:item.country.id,lat:item.latlng[0],lng:item.latlng[1],radius:item.type.radius});
    }
    return bases;
}

/**
* определение окружения полков
* @param game объект игры
* @param callback функция обратного вызова, вызываемая по завершении работы функции
**/
function setAround(game, callback){
    /*проверяем было ли изменение положения юнитов*/
    var hash = calcUnitsPositionsHash(game);
    if ( unitsPositionsHash == hash ){
        callback();
        return;
    }
    unitsPositionsHash = hash;
    
    var regiments = getRegimentsData(game);
    var bases = getBasesData(game);
    sendRequestAround(regiments, bases, function(result){
        //console.log('result: '+JSON.stringify(result));
        if (result){
            for (var i =0; i < game.regiments.length; i++)
                for ( var j = 0; j < result.length; j++ ){
                    if ( game.regiments[i].id == result[j].id ){
                        if ( game.regiments[i].around != result[j].around ){
                            if ( result[j].around ){
                                game.addGameMessage(game.gameMsgText('beginAround',game.regiments[i]));
                            }else{
                                game.addGameMessage(game.gameMsgText('endAround',game.regiments[i]));
                            }
                        }
                        game.regiments[i].around = result[j].around;
                        break;
                    }
                }      

        }
        callback();
    });
}


/**
* отправка данных об положении юнитов и получение 
* статуса их окружения  через отправку HTTP POST запроса 
* @param regiments массив объектов полков вида [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param bases массив объектов баз вида [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param callback функция обратного вызова, в которую передается обратно  
* результат расчета окружения полков в виде [{id:id, around:true}, {id:id, around:false},...]
**/
function sendRequestAround( regiments, bases, callback ){
    var path = '/around';
    var params = 'regiments=' + JSON.stringify(regiments) + '&';
    params += 'bases=' + JSON.stringify(bases);
    var results = '';
    var options = {
                    hostname: ROUTE_SERVICE_HOSTNAME,
                    port: ROUTE_SERVICE_PORT,
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
                   result = JSON.parse(results);
                   callback(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(false);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('around: problem with request: ' + e.message);
    });
    
    // write data to request body
    req.write(params);
    req.end();
}

/**
* инициализация модуля
**/
function init(db_file, callback){
    var path = '/init';
    var params = 'data=' + db_file;
    var results = '';
    var result = null;
    var options = {
                    hostname: ROUTE_SERVICE_HOSTNAME,
                    port: ROUTE_SERVICE_PORT,
                    path: path,
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    method: 'POST'
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
                    //console.log(chunk);
                    callback(false);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('around.init: problem with request: ' + e.message);
    });
    req.write(params);
    req.end();
}


exports.setAround = setAround;
exports.init = init;