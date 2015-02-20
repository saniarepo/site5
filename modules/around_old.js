/*модуль определения окружения полков*/
var Debug = require('./debug');
var http = require('http');
var ROUTE_SERVICE_HOSTNAME = '127.0.0.1'; /*хост сервиса маршрутов*/
var ROUTE_SERVICE_PORT = 8001; /*порт сервиса расчета окружения*/
var unitsPositionsHash = 0; /*хеш позиций юнитов*/


/**
* получение хеша из позиций юнитов с целью определения 
* было ли движение юнитов или нет
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
* получение координат своих баз
* @param index индекс полка в массиве полков
* @param game объект игры
* @return данные баз  в виде массива объектов вида {lat:lat, lng:lng, radius:radius} 
**/
function getOwnBaseData(index, game){
    var baseData = [];
    var basesLen = game.bases.length;
    for ( var i = 0; i < basesLen; i++ ){
        if (game.bases[i] == undefined || game.regiments[index] == undefined) continue;
        if ( game.bases[i].country.id == game.regiments[index].country.id ) {
            baseData.push({lat: game.bases[i].latlng[0], lng: game.bases[i].latlng[1], radius: game.bases[i].type.radius});
        }
    }
    return baseData;
}

/**
* получение данных вражеских полков
* @param index индекс полка в массиве полков
* @param game объект игры
* @return данные по полкам противника в виде массива объектов {lat:lat, lng:lng, radius: radius} 
**/
function getEnemyRegimentsData(index, game){
    var enemyData = [];
    var regimentsLen = game.regiments.length;
    for ( var i = 0; i < regimentsLen; i++ ){
        if (game.regiments[i] == undefined || game.regiments[index] == undefined) continue;
        if ( game.regiments[i].country.id != game.regiments[index].country.id ){
            enemyData.push({lat:game.regiments[i].latlng[0], lng:game.regiments[i].latlng[1], radius:game.regiments[i].type.radius});
        }
    }
    return enemyData;
}

/**
* определение окружения полка
* @param index индекс полка в массиве полков
* @param game объект игры
* @param callback функция обратного вызова, вызываемая по завершении работы функции
**/			
function setAround(index, game, callback){
    if ( index == undefined || index == null ){
        /*проверяем было ли изменение положения юнитов*/
        var hash = calcUnitsPositionsHash(game);
        if ( unitsPositionsHash == hash ){
            callback();
            return;
        }
        unitsPositionsHash = hash;
        index = 0;
    }
    if ( game.regiments[index] == undefined ) { return;}
    var source = {lat:game.regiments[index].latlng[0], lng:game.regiments[index].latlng[1], radius:game.regiments[index].type.radius};
    var targets = getOwnBaseData(index, game);
    var enemies = getEnemyRegimentsData(index, game);
    //console.log(source+':'+targets+':'+enemies);
    findRouteToBases(index, source, targets, enemies, function(index, result){
       if ( game.regiments[index] != undefined ){
            //console.log('result='+result);
            /*создаем игровое сообщение*/
            if ( game.regiments[index].around == result ){
                if ( result ){
                    game.addGameMessage(game.gameMsgText('endAround',game.regiments[index]));
                }else{
                    game.addGameMessage(game.gameMsgText('beginAround',game.regiments[index]));
                }
            }
            game.regiments[index].around = !result;
	    }
    });
    /*   */  
	index++;
	if (index < game.regiments.length ) {
		setAround(index, game, callback);
	}else{
	   callback();
       return;
	}
}

/**
* получение данных о наличии маршрута от полка до любой
* из своих баз с сервера маршрутов через отправку HTTP POST запроса 
* @param index индекс полка в массиве полков
* @param source объект полка вида {lat:lat,lng:lng,radius:radius}
* @param targets массив объектов своих баз вида [{lat:lat,lng:lng,radius:radius},...]
* @param enemies массив объектов полков врага вида [{lat:lat,lng:lng,radius:radius}, ...]
* @param callback функция обратного вызова, в которую передается обратно индекс и 
* результат поиска маршрута в виде true ( если есть ) или false ( если нет )
**/
function findRouteToBases( index, source, targets, enemies, callback ){
    var path = '/routetobases';
    var params = 'source=' + JSON.stringify(source) + '&';
    params += 'targets=' + JSON.stringify(targets) + '&';
    params += 'enemies=' + JSON.stringify(enemies);
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
                   callback(index, result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(index, false);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('around: find route: problem with request: ' + e.message);
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