var db = require('./database');
var elSrv = require('./google.api.elev.js');

var delta = 0.01; //точность определения точки в градусах ( 1 градус ~ 111 км )
var round = 2; //количество знаков в координатах после запятой (для округления)

/**
* получение высоты по одной точке
* сначала проверяется есть ли данные по точке в базе, если нет, то 
* делается запрос к Google и результат заносится в базу 
* @param lat, lng координаты точки
* @param callback функция обратного вызова в которую передается результат
* в виде lat,lng,el
**/
function getElevation(lat,lng,callback)
{
    db.getElevation(lat,lng,delta,function(result){
        if (result[0][0]['el'] == null )
        {
            elSrv.getElevationDot(lat,lng,function(result){
                if ( result != undefined )
                {
                    var el = result['results'][0]['elevation'];
                    db.insertElevation(lat,lng,el,function(){
                        console.log('new dot was added');
                    });//end db.insertElevation
                    callback(lat,lng,el);
                }
                else
                {
                    callback(lat,lng,undefined);
                }
                
            });//end elSrv.getElevationDot
        }
        else
        {
            callback(lat,lng,result[0][0]['el']);
        }
    });//end db.getElevation
}//end.getElevation


/**
* получение высоты по нескольким точкам
* сначала проверяется есть ли данные по точкам в базе, если нет, хотя бы по одной
* точке, то делается запрос к Google и результат заносится в базу
* @param dots массив точек вида [[lat1,lng1],[lat2,lng2],...]
* @param callback функция обратного вызова в которую передается результат
* в виде массива объектов вида {lat:lat,lng:lng,elevation:elevation}
**/
function getElevations(dots,callback) //dots - array of dots [[lat1,lng1],[lat2,lng2]]
{
    //если массив точек пуст 
    if ( dots.length == 0 ){
        callback(undefined);
        return false;
    }
    
    //округляем координаты
    for ( var i = 0, k = 1; i < round; i++ ) k *= 10;
    for ( var i = 0; i < dots.length; i++ ){
        dots[i][0] = Math.round( k * parseFloat(dots[i][0]) ) / k;
        dots[i][1] = Math.round( k * parseFloat(dots[i][1]) ) / k;
    }
    
    //проверка если точки в базе
    db.checkDots(dots,delta,function(resultInDb){
        if ( resultInDb.length == dots.length ){
            //console.log('all points presentedin database');
            callback(resultInDb);
        }
        else{
            //console.log('need requests to service... ');
            elSrv.getElevationDots(dots,function(resultFromService){
                if ( resultFromService != undefined ){
                    var result = [];
                    var results = resultFromService['results'];
                    for ( i = 0; i < results.length; i++ )
                    {
                        result.push({lat:results[i]['location']['lat'],lng:results[i]['location']['lng'],elevation:results[i]['elevation']});
                    }
                    db.insertElevationMulti(result,delta,function(res){
                        //if(res) console.log('new dots was inserted');
                        callback(result);
                    }); 
                }
                else{
                     if ( resultInDb.length > 0 ) callback(result);
                     else callback(undefined);
                }
                
            });
        } 
    });//end checkDots
    
}//end.getElevationMulti

exports.getElevation = getElevation;
exports.getElevations = getElevations;