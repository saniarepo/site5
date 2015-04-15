/**модуль получения погоды из базы**/
var START_YEAR = 1990;
var END_YEAR = 2014;
var DB_DIR = 'modules/weather/db/';
var BIG_NUM = 9999999999999999;

var sqlite3 = require('sqlite3');
var RESULT_FAIL = {result:false};
var dbStations = new sqlite3.Database(DB_DIR +'stations.sqlite');

/**
* получение погодных данных в одной точке с 
* заданными координатами на заданную дату
* @param date дата в виде ггггммдд
* @param latitude широта
* @param longitude долгота
* @param callback функция обратного вызова в которую передается результат в виде объекта
**/
function getWeather(date, latitude, longitude, callback){
	var year = date.slice(0, 4);
	if (parseInt(year) < START_YEAR || parseInt(year) > END_YEAR){
		callback(RESULT_FAIL);
		return;
	}
	date = parseInt(date);
	var lat = parseFloat(latitude);
	var lng  = parseFloat(longitude);	
	var stn = null;
	var wban = null;
	var minRast = BIG_NUM;
	var foundLat = null;
	var foundLng = null;
	
	queryStations(function(rows){
		if (rows == null){
			callback(RESULT_FAIL);
			return;
		}
		for ( var i = 0; i < rows.length; i++ ){
			var datebegin = parseInt(rows[i].datebegin);
			var dateend = parseInt(rows[i].dateend);
				
			if ( date < datebegin || date > dateend ) continue;
			var currLat = parseFloat(rows[i].lat);
			var currLng = parseFloat(rows[i].lng);
			var rast = getRast(lat, lng, currLat, currLng);
			
			if ( rast < minRast )
			{
				minRast = rast;
				stn = rows[i].stn;
				wban = rows[i].wban;
				foundLat = currLat;
				foundLng = currLng;
			}
		}
		console.log('Nearest Station: rast='+minRast+' m; stn='+stn+'; wban='+wban+'; lat='+foundLat+'; lng='+foundLng);
		if ( foundLat == null || foundLng == null ){
			callback(RESULT_FAIL);
			return;
		}
		var sql = 'SELECT * FROM meteo WHERE wban='+wban+' AND stn='+stn+' AND thedate='+date;
		queryMeteo(year, sql, function(row){
			if (row == null){
				callback(RESULT_FAIL);
				return;
			}
			var temperature = F2C(row.temperature);
			var pressure = mb2atm(row.pressure);
			var wind = node2ms(row.wind);
			var response = {};
			response.result = true;
			response.temperature = temperature;
			response.pressure = pressure;
			response.wind = wind;
			response.rast = minRast;
			response.stn = stn;
			response.wban = wban;
			response.found_lat = foundLat;
			response.found_lng = foundLng;
			callback(response);
		});		
	});
}

/**
* получение погодных данных в наборе точек с 
* заданными координатами на заданную дату
* @param date дата в виде ггггммдд
* @param dots набор точек, заданный в форме: lat1,lng1|lat2,lng2|lat3,lng3
* @param callback функция обратного вызова в которую передается результат в виде объекта
**/
function getWeatherMulti(date, dots, callback){
	var year = date.slice(0, 4);
	if (parseInt(year) < START_YEAR || parseInt(year) > END_YEAR){
		callback(RESULT_FAIL);
		return;
	}
	date = parseInt(date);
	var points = [];
	var count = 0;
	var dottext = dots.split('|');
	for ( var i = 0; i < dottext.length; i++ ){
		points.push([parseFloat(dottext[i].split(',')[0]), parseFloat(dottext[i].split(',')[1])]);
	}
	console.log(date > parseInt(''));
	queryStations(function(rows){
		if (rows == null){
			callback(RESULT_FAIL);
			return;
		}
		var minRast = [];
		var stn = [];
		var wban = [];
		var foundLat = [];
		var foundLng = [];
		var rast = 0;
		var stnCoords = {};
		for ( var i = 0; i < points.length; i++ ){
			minRast.push(BIG_NUM);
			stn.push(0);
			wban.push(0);
			foundLat.push(0);
			foundLng.push(0);
		}
		for ( var i = 0; i < rows.length; i++ ){
			var datebegin = parseInt(rows[i].datebegin);
			var dateend = parseInt(rows[i].dateend);
				
			if ( date < datebegin || date > dateend || isNaN(datebegin) || isNaN(dateend))  continue;
			var currLat = parseFloat(rows[i].lat);
			var currLng = parseFloat(rows[i].lng);			 
			for ( var j = 0; j < points.length; j++ ){
				rast = getRast(points[j][0], points[j][1], currLat, currLng);				
				if ( rast < minRast[j] )
				{
					minRast[j] = rast;
					stn[j] = rows[i].stn;
					wban[j] = rows[i].wban;
					foundLat[j] = currLat;
					foundLng[j] = currLng;
					stnCoords[stn[j]+'-'+wban[j]+'_lat'] = currLat;
					stnCoords[stn[j]+'-'+wban[j]+'_lng'] = currLng;
				}
			}			
		}
		
		var sql = 'SELECT * FROM meteo WHERE thedate='+date+' AND (';
		for(var i = 0; i < points.length; i++){
			if (!wban[i] || !stn[i]) continue;
			sql += "(wban="+wban[i]+" AND stn="+stn[i]+")";
			if (i < points.length - 1) sql += ' OR ';
		}
		sql += ')';
		console.log(sql);
		queryMeteoMulti(year, sql, function(rows){
			if (rows == null){
				callback(RESULT_FAIL);
				return;
			}
			var response = {};
			response.result = true;
			response.data = [];			
			for ( var i = 0; i < rows.length; i++ ){
				var item = {};
				item.temperature = F2C(rows[i].temperature);
				item.pressure = mb2atm(rows[i].pressure);
				item.wind = node2ms(rows[i].wind);
				item.stn = rows[i].stn;
				item.wban = rows[i].wban;
				item.found_lat = stnCoords[rows[i].stn+'-'+rows[i].wban+'_lat'];
				item.found_lng = stnCoords[rows[i].stn+'-'+rows[i].wban+'_lng'];
				response.data.push(item);
			}
			callback(response);
		});		
	});
}

/**
* получение данных по станциям из базы
**/
function queryStations(callback){
	if(!dbStations){
		callback(null);
		return;
	}
	var sql = 'SELECT * FROM station';
	dbStations.all(sql, function(err, rows){
		if ( err == null ){
			callback(rows);
		}else{
			callback(null);
		}
	});
}

/**
* получение метеоданных из базы (одна строка)
**/
function queryMeteo(year, sql, callback){
	db = new sqlite3.Database(DB_DIR + 'weather.' + year + '.sqlite');
	db.get(sql, function(err, row){
		if (!err){
			callback(row);
		}else{
			console.log(err);
			callback(null);
		}
	});	
}

/**
* получение метеоданных из базы (много строк)
**/
function queryMeteoMulti(year, sql, callback){
	db = new sqlite3.Database(DB_DIR + 'weather.' + year + '.sqlite');
	db.all(sql, function(err, rows){
		if (!err){
			callback(rows);
		}else{
			console.log(err);
			callback(null);
		}
	});	
}

/**
* вычисление расстояния между двумя точками на сфере
**/
function getRast(llat1,llng1,llat2,llng2){
	/**pi - число pi, rad - радиус сферы (Земли)**/
	var rad = 6372795;

	/**в радианах**/
	var lat1 = llat1*Math.PI/180;
	var lat2 = llat2*Math.PI/180;
	var long1 = llng1*Math.PI/180;
	var long2 = llng2*Math.PI/180;

	/**косинусы и синусы широт и разницы долгот**/
	var cl1 = Math.cos(lat1)
	var cl2 = Math.cos(lat2)
	var sl1 = Math.sin(lat1)
	var sl2 = Math.sin(lat2)
	var delta = long2 - long1
	var cdelta = Math.cos(delta)
	var sdelta = Math.sin(delta)

	/**вычисления длины большого круга**/
	var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2))
	var x = sl1*sl2+cl1*cl2*cdelta
	var ad = Math.atan2(y,x)
	var dist = ad*rad
	return dist;
}

/**
* перевод из градусов по Фаренгейту в градусы по Цельсию
* @param float t температура в градусах по Фаренгейту
* @return float температура в градусах по Цельсию
**/
function F2C(t)
{
	return 5*(t - 32)/9;
}

/**
* перевод скорости из узлов в м/с
* @param node скорость в узлах
* @return скорость в м/с
**/
function node2ms(node)
{
	if (node==9999.9) return null;
	return 0.514 * node;
}

/**
* перевод давления из миллибар в атмосферы
* @param mbar давление в миллибарах
* @return давление в атмосферах
**/
function mb2atm(mbar)
{
	if(mbar == 9999.9) return null;
	return 0.000986923 * mbar;
}

exports.getWeather = getWeather;
exports.getWeatherMulti = getWeatherMulti;