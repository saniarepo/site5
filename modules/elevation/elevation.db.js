/**получение высот из базы высот**/
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('modules/elevation/el2.sqlite');
var delta = 0.01;
var resultArr = [];

/**
* получение имени таблицы из числа
* @param index число
* @return string имя таблицы
**/
function number2tablename(index){
	var tableName = "";
	if ( index < 0 ){
		tableName += "n";
	}else{
		tableName += "p";
	}
	tableName += Math.floor(Math.abs(index)) + '_elevation';
	return tableName;
}

/**
* получение высоты точки из базы с разбиением данных на множество таблиц
* @param dot точка в виде массива [lat,lng]
* @param callback функция обратного вызова в которую передается 
* результат в виде: {lat_origin: lat, lng_origin: lng, lat:lat, lng:lng, elevation: elevation} 
**/
function getElevation(dot, callback){
	var latMin = dot[0] - delta;
	var latMax = dot[0] + delta;
	var lngMin = dot[1] - delta;
	var lngMax = dot[1] + delta;
	
	var tableName = number2tablename(dot[0]);
	var sql = "SELECT lat, lng, el FROM " + tableName + " WHERE ";
	sql += "lat > " + latMin + " AND lat < " + latMax + " AND ";
	sql += "lng > " + lngMin + " AND lng < " + lngMax;
	sql += " LIMIT 1";
	console.log(sql);
	db.get(sql, function(err, row){
		if ( err == null ){
			callback({lat_origin:dot[0], lng_origin:dot[1], lat:row.lat, lng:row.lng, elevation: row.el});
		}else{
			console.log(err);
			callback(null);
		} 
	});
}

/**
* получение высот нескольких точек из базы с разбиением данных на множество таблиц
* @param dots массив точек в виде  [[lat1,lng1], [lat2,lng2],...]
* @param callback функция обратного вызова в которую передается 
* результата в виде массива объектов: [{lat_origin: lat, lng_origin: lng, lat:lat, lng:lng, elevation: elevation},...] 
**/
function getElevations(dots, callback){
	resultArr = [];
	var group = groupDots(dots);
	//console.log(group);
	var arrSQL = prepSQLArray(group);
	//console.log(arrSQL);
	queryArrayRun(0, arrSQL, callback);
}

/**
* подготовка строки запроса из массива с данными
* @param dots массив точек вида [[lng1, lat1], [lng2, lat2], ...]
* @return sql строка запроса
**/
function prepSQL(table, dots){
	var sql = "";
	if ( dots.length > 0 ){
		sql = "SELECT lat, lng, el AS elevation FROM " + table + " WHERE ";
		for ( var i = 0; i < dots.length; i++ ){
			var latMin = dots[i][0] - delta;
			var latMax = dots[i][0] + delta;
			var lngMin = dots[i][1] - delta;
			var lngMax = dots[i][1] + delta;
			sql += " ( lat > " + latMin + " AND lat < " + latMax + " AND ";
			sql += "lng > " + lngMin + " AND lng < " + lngMax +" ) ";
			if ( i < dots.length-1 ) sql += " OR ";
		}
	}
	return sql;
} 


/**
* подготовка массива строк с запросами из объекта со сгруппированными точками
* @param group объект вида {tablename1:[[lat1,lng1],[lat2,lng2]], tablename2:[[lat3,lng3],[lat4,lng4]], ...}
* @return arrSQL массив строк запроса
**/
function prepSQLArray(group){
	var arrSQL = [];
	for ( var table in group ){
		arrSQL.push(prepSQL(table, group[table]));
	}
	return arrSQL;
}

/**
* выполнение нескольких запросов последовательно (использование рекурсии)
* @param index индекс запроса в массиве запросов
* @param arrSQL массив запросов (массив строк)
* @param callback функция обратного вызова, вызываемая после выполнения всех запросов
**/
function queryArrayRun(index, arrSQL, callback){
	db.all(arrSQL[index], function(err, rows){
		if ( err == null ){
			for ( var i = 0; i < rows.length; i++ ){
				resultArr.push(rows[i]);
			}
		}else{ console.log(err); }
		index++;
		if ( index < arrSQL.length ){
			queryArrayRun(index, arrSQL, callback);
		}else{
			callback(resultArr);
		}
	});
}

/**
* преобразование массива dots в объект  
* группирующий точки  которые относятся к соотвествующим таблицам
* @param dots массив точек вида [[lng1, lat1], [lng2, lat2], ...]
* @return group объект вида {tablename1:[[lat1,lng1],[lat2,lng2]], tablename2:[[lat3,lng3],[lat4,lng4]], ...}
**/
function groupDots(dots){
	var group = {};
	for ( var i = 0; i < dots.length; i++ ){
		var tableName = number2tablename(dots[i][0]);
		if ( group[tableName] == undefined ){
			group[tableName] = [dots[i]];
		}else{
			group[tableName].push(dots[i]);
		}
	}
	return group;
}

/**
* получение имени таблицы из числа
* @param index число
* @return string имя таблицы
**/
function number2tablename(index){
	var tableName = "";
	if ( index < 0 ){
		tableName += "n";
	}else{
		tableName += "p";
	}
	tableName += Math.floor(Math.abs(index)) + '_elevation';
	return tableName;
}


exports.getElevation = getElevation;
exports.getElevations = getElevations;