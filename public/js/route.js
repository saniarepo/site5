/*объект для получения маршрута*/
var Route =
{
	service: 'google', /*возможные варианты: 'osrm','google','spatialite'*/
    
    /*объект directionsService*/
    directionsService: new google.maps.DirectionsService(),
	
    getRoute: function(latlng,regiment,callback){
        console.log('url='+routeServiceUrl);
        if ( Route.service == 'google' ){
            Route.getRouteGoogle(latlng,regiment,callback);
        }else if ( Route.service == 'spatialite'  ){
            Route.getRouteSpatialite(latlng,regiment,callback);
        }else if ( Route.service == 'osrm' ){
            Route.getRouteOSRM(latlng,regiment,callback);
        }else{
            Route.getRouteGoogle(latlng,regiment,callback);
        }
    },
    
    /**получение маршрута с сервиса маршрутов Google через JS API
    * @param e объект события
    * @param regiment объект полка
    * @param callback объект в который передается маршрут в виде массива точек и объект полка
    **/
	getRouteGoogle: function(latlng,regiment,callback){
		var start = new google.maps.LatLng(regiment.marker.type.getLatLng().lat, regiment.marker.type.getLatLng().lng);
		var end = new google.maps.LatLng(latlng.lat, latlng.lng);
		var request = {
					  origin: start,
					  destination: end,
					  //задание путевой точки
					  //waypoints: [{location: new google.maps.LatLng(56.64,47.82 ), stopover: false}],
					  travelMode: google.maps.TravelMode.DRIVING
					};
		Route.directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				var points = response.routes[0].overview_path;
                var route = [];
    			for ( var i = 0; i < points.length; i++ ){
    				route.push([points[i]['k'],points[i]['D']]);
    			}
                callback(route,regiment);
			}
		});
	},
    
    
    /**
    * получение маршрута от модуля Spatialite
    * @param e объект события
    * @param regiment объект полка
    * @param callback функция обратного вызова в которую передается маршрут и объект полка
    **/
    
    getRouteSpatialite: function(latlng,regiment,callback){
		var start = [regiment.marker.type.getLatLng().lat, regiment.marker.type.getLatLng().lng];
		var end = [latlng.lat, latlng.lng];
		var params = 'data=' + JSON.stringify([start,end]);
		Ajax.sendRequest('GET', 'http://' + routeServiceUrl + '/routespatialite', params, function(route) {
			console.log(JSON.stringify(route));
            callback(route,regiment);
		});
	},
    
    /**
    * получение маршрута от модуля OSRM
    * @param e объект события
    * @param regiment объект полка
    * @param callback функция обратного вызова в которую передается маршрут и объект полка
    **/
    
    getRouteOSRM: function(latlng,regiment,callback){
		var start = [regiment.marker.type.getLatLng().lat, regiment.marker.type.getLatLng().lng];
		var end = [latlng.lat, latlng.lng];
		var params = 'data=' + JSON.stringify([start,end]);
		Ajax.sendRequest('GET', 'http://' + routeServiceUrl + '/routeosrm', params, function(route) {
			console.log(JSON.stringify(route));
            callback(route,regiment);
		});
	}

}