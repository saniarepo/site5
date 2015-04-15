/*модуль маршрутов spatialite*/
var sqlite = require('spatialite');
var db = null; 
var loaded_file = ''; /*имя файла загруженной базы данных*/ 
var roads = []; /**массив дорог**/
var nodes = [];/**массив узлов**/
var index_from = []; /**индексные таблицы для ускорения поиска**/
var index_size = []; 
var n = 0; /**количество вершин графа**/
var m = 0; /**количество дуг графа**/
var INF = 999999999; /**большое число**/
var margin = 0.6; /**коэффициент расширения для определения части графа для обсчета**/
var margin2 = 2.0;/**коэффициент расширения для определения части графа для обсчета**/
var ready = false;
var DB_FOLDER = 'db'; /*каталог с базами данных*/
var CONNECTED_COFF = 0.95; /**часть связных узлов**/

/**
* выполнение запроса и получение результатов в виде массива объектов
* @param sql строка запроса
* @param callback функция обратного вызова в которую передается результат
* в виде массива объектов
**/
function query(sql, callback){
	db.spatialite(function(err) {
		db.all(sql, function(err, rows) {
			results = [];
			if ( rows != undefined ){
				if ( rows != null ){
					for ( var i = 0; i < rows.length; i++ ){
						results.push(rows[i]);
					}			
				}
			}
			callback(results);
		});
	});
}


/**
* получение дорог из базы в виде массива объектов и запись в массив roads + заполнение индексных массивов
* @param callback функция обратного вызова
* roads - массив объектов вида {node_from:node_from,node_to:node_to,name:name,cost:cost,length:length,lat_from:lat_from,lng_from:lng_from,lat_to:lat_to,lng_to:lng_to}
**/
function loadRoads(callback){
	var sql = "SELECT node_from, node_to, name, cost, length, Y(rn.geometry) "; 
		sql += "AS lat_from, X(rn.geometry) AS lng_from, Y(rn2.geometry) "; 
		sql += "AS lat_to, X(rn2.geometry) AS lng_to, AsGeoJSON(r.geometry) AS geometry ";  
		sql += "FROM roads r,roads_nodes rn, roads_nodes rn2 "; 
		sql += "WHERE r.node_from=rn.node_id AND r.node_to=rn2.node_id ORDER BY node_from,node_to";
	
	
	db.spatialite(function(err) {
		db.all(sql, function(err, rows) {
			if ( rows != undefined ){
				if ( rows != null ){
					//записываем в массив
					var geom = null;
					for ( var i = 0; i < rows.length; i++ ){
						roads.push(rows[i]);
						geom = JSON.parse(rows[i].geometry);
						geom.coordinates.reverse();
						roads.push({node_from:rows[i].node_to, node_to:rows[i].node_from,cost:rows[i].cost,length:rows[i].length,geometry:JSON.stringify(geom)});
					}
					m = roads.length;
					//сортируем
					roads.sort(function(x,y){ return x.node_from-y.node_from});
					
					var curr_from = 0;
					var prev_from = 0;
					for ( var i = 0; i < m; prev_from = curr_from,i++ ){
						curr_from = roads[i].node_from;
						if ( curr_from != prev_from ){ //если from новый записываем его начальный индекс в index_from
							if ( curr_from - 1 > index_from.length ){
								for ( var j = 0; j < (curr_from - 1 - index_from.length); j++ ){
									index_from.push(-1);
									index_size.push(0);
								}
							}
							index_from.push(i);
							index_size.push(1);
						}else{ //если from старый увеличиваем последний index_size
							index_size[index_size.length-1]++;
						}
					}			
				}
			}
			callback();
		});
	});
}

/**
* получение узлов графа из базы в виде массива объектов и запись в массив nodes
* @param callback функция обратного вызова
* nodes - массив объектов вида {node_id:node_id,cardinality:cardinality,lat:lat,lng:lng, connected:connected, allowed:allowed,access:access}
**/
function loadNodes(callback){
	var sql = "SELECT node_id, cardinality, Y(geometry) AS lat, X(geometry) AS lng FROM roads_nodes"; 
	db.spatialite(function(err) {
		db.all(sql, function(err, rows) {
			if ( rows != undefined ){
				if ( rows != null ){
					for ( var i = 0; i < rows.length; i++ ){
						rows[i].connected = false;
                        rows[i].allowed = true;
                        rows[i].access = false;
                        nodes.push(rows[i]);
					}			
				}
			}
			n = nodes.length;
			callback();
		});
	});
}

/**
* получение стоимости дуги графа из узла from в узел to
**/
function getCost(from,to,banned){
	if (from == to ) return 0;
	for ( var i = 0; i < banned.length; i++ ){
		if ( from == banned[i] || to == banned[i] ) return INF;
	}
	if ( index_size[from-1] == 0 && index_size[to-1] == 0 ) return INF;
	for ( var i = index_from[from-1]; i < index_from[from-1] + index_size[from-1]; i++ ){
		if ( roads[i].node_from == from && roads[i].node_to == to ){
			return roads[i].cost;
		} 
	}
	return INF;
}

/**
* получение геометрии ( как массива точек ) дуги графа из узла from в узел to
**/
function getCoordinates(from,to){
	var geom = null;
	if (from == to ) return [];
	if ( index_size[from-1] == 0 && index_size[to-1] == 0 ) return [];
	for ( var i = index_from[from-1]; i < index_from[from-1] + index_size[from-1]; i++ ){
		if ( roads[i].node_from == from && roads[i].node_to == to ){
			geom = JSON.parse(roads[i].geometry);
			return geom.coordinates;
		} 
	}
	return [];
}

/**
* получение id узлов инцидентных данному
**/
function getIncident(curr){
	var incident = [];
	if ( curr > n || curr < 1 ) return incident;
	for ( var i = index_from[curr-1]; i <  index_from[curr-1] + index_size[curr-1]; i++ ){
		incident.push(i);
	}
	return incident;
}

/**
* загрузка данных из базы
* инициализация начальных значений переменных
* @param функция обратного вызова
**/
function init(db_file, callback){
	if ( db_file == loaded_file ){
       callback();
       return;
	} 
    
    loaded_file = db_file;
    clear();
    console.log('load graph...');
    db = new sqlite.Database('services/around/' + DB_FOLDER + '/' + db_file);
    loadNodes(function(){
		loadRoads(function(){
			fillConnectedNodes(0, function(){
                ready = true;
                console.log('graph from database '+ db_file +' loaded: nodes: ' + n + '; roads: ' + m);
                callback();
			});
		})
	});
}

/**
* очистка данных содержащих граф
* @param callback функция обратного вызова
**/
function clear(){
    console.log('unload graph...');
    db = null;
    roads= [];
    nodes = [];
    index_from = [];
    index_size = [];
    n = 0;
    m = 0;
    ready = false;
}

/**
* определение маршрута запросом к базе
* @param from начальная точка
* @param to конечная точка
* @param callback функция обратного вызова в которую передается результат в виде
* массива точек [[lat1, lng1], [lat2,lng2],...]]
**/

function routeQuery(from, to, callback){
	if (!ready){
	   callback([]);
       return;
	}
    var start = latlng2node_id([from.lat,from.lng]);
    var end = latlng2node_id(to);
	//console.log(start+':'+end);
	var sql = "SELECT AsGeoJSON(geometry) AS geometry FROM roads_net WHERE ";
	sql += "NodeFrom=" + start + " AND NodeTo=" + end; 
	sql += " LIMIT 1;"
    //console.log(sql);
	db.spatialite(function(err) {
		db.get(sql, function(err, row) {
            //console.log(JSON.stringify(row));
            route = [];
			if ( row != undefined ){
				if ( row.geometry != null ){
					var obj = JSON.parse(row.geometry);
					route = obj.coordinates;
				}
			}
			//console.log(JSON.stringify(reverse(route)));
            callback(reverse(route));
		});
	});
}


/**
* поиск маршрута до любой из заданных баз с обходом полков неприятеля
* волновым алгоритмом
* @param from начальная точка вида {lat:lat,lng:lng,radius:radius}
* @param to  массив конечных точек (объектов баз) вида [{lat:lat,lng:lng,radius:radius},...]
* @param enemy массив полков неприятеля вида [{lat:lat, lng:lng, radius:radius}, ...]
* @param callback функция обратного вызова в которую передается результат в виде
* true(если маршрут найден) или false (если не найден)
**/
function findRouteToBases(from, to, enemy, callback){
    if (!ready){
	   callback(true);
       return;
	}
    var waveLabel = []; /**волновая метка**/
	var T = 0;/**время**/
	var oldFront = [];/**старый фронт**/
	var newFront = [];/**новый фронт**/
	var prev = []; /**предки вершин**/
	var curr = null;
	var id = null;
	for ( var i = 0; i < n; i++ ){
		waveLabel[i] = -1;
		prev[i] = 0;
	}
	var start = latlng2node_id([from.lat,from.lng]);
    var targets = getTargetsNodesId(to);
	waveLabel[start-1] = 0;
	oldFront.push(start);
	var banned = getBannedNodesId2(from, enemy);
    
	while (true){
		//console.log(JSON.stringify(oldFront));
		for ( var i = 0; i < oldFront.length; i++ ){
			curr = oldFront[i];
			//console.log('curr='+curr);
			for ( j = index_from[curr-1]; j < index_from[curr-1] + index_size[curr-1]; j++ ){
				id = roads[j].node_to;
				if ( banned.indexOf(id) != -1 ) continue;
				//console.log('id='+id);
				//console.log('waveLabel[id]='+waveLabel[id-1] );
				if ( waveLabel[id-1] == -1 ){
					waveLabel[id-1] = T + 1;
					newFront.push(id);
					prev[id-1] = curr;
				}
				
				if ( targets.indexOf(id) != -1 ){
					//решение найдено
					//вывод результатов
					callback(true);
					return true;
				}
			}
		}
		if ( newFront.length == 0 ){
			callback(false);
			return false;
		}
		oldFront = newFront;
		newFront = [];
		T++;
	}
}

/**
* обсчет позиций юнитов и вычисление полков находящихся в окружении 
* @param regiments массив объектов полков вида [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param bases массив объектов баз вида [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param callback функция обратного вызова, в которую передается обратно  
* результат расчета окружения полков в виде [{id:id, around:true}, {id:id, around:false},...]
**/
function around(regiments, bases, callback){
    //console.log('regiments: '+JSON.stringify(regiments));
    //console.log('bases: '+JSON.stringify(bases));
    var result = [];
    var item = null;
    for (var i = 0; i < regiments.length; i++){
        result.push({id:regiments[i].id, around:false});
    }
    var countries = getCountries(regiments, bases);
    if ( countries.length < 2 ){
        callback(result);
        return;
    }else{
        startWave( 0, countries, regiments, bases, result, callback );
    }  
}

/**
* запуск волнового алгортма на графе дорожной сети с целью выявить доступность узлов
* и расчет на основании этого факта окружения юнитов
* @param countryIndex индекс в массиве id стран
* @param countries массив стран
* @param regiments массив объектов полков вида [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param bases массив объектов баз вида [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param callback функция обратного вызова, в которую передается обратно  
* результат расчета окружения полков в виде [{id:id, around:true}, {id:id, around:false},...]
**/
function startWave( countryIndex, countries, regiments, bases, result, callback ){
    if( countryIndex < 2 ){
        waveClear();
        var basesNodes = getUnitsNodes(getUnitsFromCountry(bases, countries[countryIndex]));
        var countryIndexEnemy = ( countryIndex == 0 )? 1 : 0;
        setNotAllow(getUnitsFromCountry(regiments, countries[countryIndexEnemy]));
        wave(basesNodes.all, function(){
            regimentsNodes = getUnitsNodes(getUnitsFromCountry(regiments, countries[countryIndex]));
            for ( var k = 0; k < result.length; k++ ){
                var oneRegimentNodes = regimentsNodes[result[k].id];
                if ( oneRegimentNodes ){
                    var regimentAround = true;
                    for ( p = 0; p < oneRegimentNodes.length; p++ ){
                        if ( nodes[oneRegimentNodes[p]-1].access ){
                            regimentAround = false;
                            break;
                        } 
                    }
                    result[k].around = regimentAround;
                }
            }
            countryIndex++;
            startWave( countryIndex, countries, regiments, bases, result, callback );
        });
    }else{
        callback(result);
        return;
    }  
}

/**
* запуск волнового алгортма на графе дорожной сети с целью 
* определения достижимости узлов из заданных узлов startNodes
* @param startNodes массив id начальных узлов от которых будет запущен алгоритм
* @param callback функция обратного вызова по окончании операции
**/
function wave(startNodes, callback){
    var waveLabel = []; /**волновая метка**/
	var T = 0;/**время**/
	var oldFront = [];/**старый фронт**/
	var newFront = [];/**новый фронт**/
	var curr = null;
	var id = null;
	for ( var i = 0; i < n; i++ ){
		waveLabel[i] = -1;
	}
	
	for ( var i = 0; i < startNodes.length; i++ ){
        waveLabel[startNodes[i]-1] = 0;
        oldFront.push(startNodes[i]);
        nodes[startNodes[i]-1].access = true;
	}
    
	while (true){
		//console.log(JSON.stringify(oldFront));
		for ( var i = 0; i < oldFront.length; i++ ){
			curr = oldFront[i];
			//console.log('curr='+curr);
			for ( j = index_from[curr-1]; j < index_from[curr-1] + index_size[curr-1]; j++ ){
				id = roads[j].node_to;
                if ( !nodes[id-1].allowed ) continue;
				if ( waveLabel[id-1] == -1 ){
					waveLabel[id-1] = T + 1;
					newFront.push(id);
					nodes[id-1].access = true;
     
				}
			}
		}
		if ( newFront.length == 0 ){
			/*распостранение волны закончено*/
			callback();
            return;
		}
		oldFront = newFront;
		newFront = [];
		T++;
	}
}

/**
* преобразование последовательности id узлов в массив путь
* в виде
* массива точек [[lat1, lng1], [lat2,lng2],...]]
* @param path последовательность узлов
* @return route массив точек [[lat1, lng1], [lat2,lng2],...]]
**/
function path2route(path){
	var route = [];
	var len = path.length;
	var prev = 0;
	var geom = null;
	for ( var curr = 0; curr < len; prev = curr, curr++ ){
		geom = getCoordinates(path[prev],path[curr]);
		for ( var i = 0; i < geom.length; i++ ){
			route.push(geom[i]);
		}
	}
	return reverse(route);
}

/**
* меняем местами широту и долготу в массиве точек
**/
function reverse(route){
    var reverse_route = [];
    for (var i = 0; i < route.length; i++){
        var dot = [route[i][1], route[i][0]];
        reverse_route.push(dot);
    }
    return reverse_route;
}

/**
* меняем местами широту и долготу в массиве массивов точек
**/
function reverse2(route){
    var reverse_route = [];
    for (var i = 0; i < route.length; i++){
        reverse_route.push(reverse(route[i]));
    }
    return reverse_route;
}

/**
* получение координат узла по id
* @param node_id id узла
* @return массив координат [lat,lng]
**/
function node_id2latlng(node_id){
	if ( node_id < 0 || node_id >= n ) return [undefined, undefined];
	return [nodes[node_id - 1].lat, nodes[node_id - 1].lng];
}

/**
* получение id узла по координатам
* @param dot массив координат [lat,lng]
* @return id узла 
**/
function latlng2node_id(dot){
	var node_id = 1;
	var minDist = distance(dot,nodes[1]);
	for ( var i = 0; i < n; i++ ){
		if ( !nodes[i].connected ) continue;
        var currDist = distance(dot, nodes[i]);
		if ( currDist < minDist ){
			node_id = nodes[i].node_id;
			minDist = currDist;
		}
	}
	return node_id;
}

/**
* получение id узла по координатам в усеченном графе
* @param dot массив координат [lat,lng]
* @return id узла 
**/
function latlng2node_id_part(dot,nodes_part,u){
	var node_id = 0;
	var minDist = distance(dot,nodes[nodes_part[0]]);
	for ( var i = 0; i < u; i++ ){
	   if ( !nodes[nodes_part[i]].connected ) continue;
		var currDist = distance(dot, nodes[nodes_part[i]]);
		if ( currDist < minDist ){
			node_id = i;
			minDist = currDist;
		}
	}
	return node_id;
}

/**
* вычисление квадрата расстояния между точкой и узлом графа
* @param dot точка, заданная как массив координат [lat,lng]
* @param node узел графа, заданный как объект вида {node_id:node_id,lat:lat,lng:lng }
* @return квадрат расстояния (без учета кривизны) 
**/
function distance(dot, node){
	return (dot[0]-node.lat)*(dot[0]-node.lat) + (dot[1]-node.lng)*(dot[1]-node.lng);
}


/**
* получение всех запрещенных узлов
**/
function getBannedNodesId(enemy){
	var restricted = [];
	for ( var i = 0; i < enemy.length; i++ ){
		for ( var j = 0; j < n; j++ ){
			if ( rastGrad2([enemy[i].lat,enemy[i].lng],nodes[j]) <= enemy[i].radius ){
				restricted.push(j+1);
			}
		}
	}
	return restricted;
}

/**
* получение всех запрещенных узлов 2 вариант (исключаем узлы в радиусе полка)
**/
function getBannedNodesId2(from, enemy){
	var restricted = [];
	var condition = false;
    for ( var i = 0; i < enemy.length; i++ ){
		for ( var j = 0; j < n; j++ ){
			condition = rastGrad2([enemy[i].lat,enemy[i].lng],nodes[j]) <= enemy[i].radius &&
                        rastGrad2([from.lat,from.lng],nodes[j]) >= from.radius;
            if ( condition ){
				restricted.push(j+1);
			}
		}
	}
	return restricted;
}

/**
* получение всех целевых узлов
**/
function getTargetsNodesId(to){
	var targets = [];
	for ( var i = 0; i < to.length; i++ ){
		targets.push(latlng2node_id([to[i].lat, to[i].lng]));
	}
	return targets;
}

/**
* получение id узлов относящихса к юнитам
* @param units массив объектов юнитов
* @return объект содержащий массив id узлов графа, относящихся ко всем юнитам,
* и массивы id узлов графа по каждому массиву отдельно
**/
function getUnitsNodes(units){
	var ids = {all:[]};
    for ( var j = 0; j < units.length; j++ ){
        ids[units[j].id] = [];
        for ( var i = 0; i < n; i++ ){
            if ( rastGrad2([units[j].lat,units[j].lng], nodes[i]) <= units[j].radius ){
                if ( ids.all.indexOf(i+1) == -1 ) ids.all.push(i+1);
                ids[units[j].id].push(i+1);
            }
            if ( ids[units[j].id].length == 0 ){
                ids[units[j].id].push(latlng2node_id([units[j].lat,units[j].lng]));
            }
        }
    }
	return ids;
}



/**
* получение флага готовности
**/
function getReady(){
    return ready;
}

/**
* вычисление расстояния на сфере  в градусах
* @param do1,dot2 точки, заданные массивами кооординат [lat,lng]
**/
function rastGrad(dot1,dot2){

	/**координаты двух точек**/
	var llat1 = dot1[0];
	var llong1 = dot1[1];

	var llat2 = dot2[0];
	var llong2 = dot2[1];

	/**в радианах**/
	var lat1 = llat1*Math.PI/180;
	var lat2 = llat2*Math.PI/180;
	var long1 = llong1*Math.PI/180;
	var long2 = llong2*Math.PI/180;

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
	var dist = ad*180/Math.PI;
	return dist;
}

/**
* вычисление расстояния на сфере  в градусах
* @param dot точкf, заданная массивом кооординат [lat,lng]
* @param node узел графа, заданный как объект вида {node_id:node_id,lat:lat,lng:lng }
**/
function rastGrad2(dot, node){
    return rastGrad(dot, [node.lat, node.lng]);
}


/**
* заполнение поля connected (которое обозначает принадлежность узла к связной части графа) у узлов графа
* @param index номер попытки
* @param callback функция обратного вызова в которую передается результат в виде
* массива id узлов [id1, id2,...]]
**/
function fillConnectedNodes(index, callback){
	var connectedNodes = 0;/**счетчик связных узлов**/
    var waveLabel = []; /**волновая метка**/
	var T = 0;/**время**/
	var oldFront = [];/**старый фронт**/
	var newFront = [];/**новый фронт**/
	var curr = null;
	var id = null;
	for ( var i = 0; i < n; i++ ){
		waveLabel[i] = -1;
	}
	var start = Math.floor(n/2+index);
	console.log('fillConnectedNodes: start='+start);
	waveLabel[start-1] = 0;
	oldFront.push(start);
	nodes[start-1].connected = true;
    connectedNodes++;
	while (true){
		//console.log(JSON.stringify(oldFront));
		for ( var i = 0; i < oldFront.length; i++ ){
			curr = oldFront[i];
			//console.log('curr='+curr);
			for ( j = index_from[curr-1]; j < index_from[curr-1] + index_size[curr-1]; j++ ){
				id = roads[j].node_to;
				if ( waveLabel[id-1] == -1 ){
					waveLabel[id-1] = T + 1;
					newFront.push(id);
					nodes[id-1].connected = true;
                    connectedNodes++;
				}
			}
		}
		if ( newFront.length == 0 ){
			/*распостранение волны закончено*/
			if ( connectedNodes >= n * CONNECTED_COFF ){
				console.log('Found connected nodes: '+connectedNodes);
				callback();
				return;
			}else{
				fillConnectedNodes(index+1, callback)
				return;
			}
		}
		oldFront = newFront;
		newFront = [];
		T++;
	}
}


/**
* разрешение всех узлов, сброс флага доступности
**/
function waveClear(){
    for ( var i = 0; i < n; i++ ){
        nodes[i].allowed = true;
        nodes[i].access = false;
    } 
}

/**
* запрет узлов перекрытых юнитами
**/
function setNotAllow(units){
    for ( var i = 0; i < n; i++ ){
        for ( var j = 0; j < units.length; j++ ){
            if ( rastGrad2([units[j].lat,units[j].lng], nodes[i]) <= units[j].radius ){
                nodes[i].allowed = false;
            }
        }
    }
}

/**
* получение списка стран
* @param regiments,bases массивы объектов полков и баз
* @return countries массив id стран
**/
function getCountries(regiments,bases){
    var countries = [];
    var country = null;
    for ( var i = 0; i < regiments.length; i++ ){
        country = regiments[i].country;
        if ( countries.indexOf(country) == -1 )
            countries.push(country);
    }
    for ( var i = 0; i < bases.length; i++ ){
        country = bases[i].country;
        if ( countries.indexOf(country) == -1 )
            countries.push(country);
    }
    return countries;
}

/**
* получение массива юнитов, относящихся к заданной стране
* units массив объектов юнитов
* @param country
* @return массив объектов юнитов относящихся к заданой стране 
**/
function getUnitsFromCountry(units, country){
    var unitsFromCountry = [];
    for ( var i = 0; i < units.length; i++ ){
        if ( units[i].country == country ){
            unitsFromCountry.push(units[i]);
        }
    }
    return unitsFromCountry;
}


exports.init = init;
exports.query = query;
exports.loadNodes = loadNodes;
exports.latlng2node_id = latlng2node_id;
exports.getCost = getCost;
exports.routeQuery = routeQuery;
exports.findRouteToBases = findRouteToBases;
exports.getReady = getReady;
exports.around = around;