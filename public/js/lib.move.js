/**
* объект содержащий функции и переменнные обеспечивающие движения юнитов
**/
var Move = 
{
	/*разрешено ли движение*/
    ENABLED: false,
    /*включена ли пауза*/
    PAUSE: false,
    /*длительность такта анимации в мс*/
    DELTA_TIME: 100,
    /**
    * преобразование массива точек в массив объектов latlng
    * @param dots массив точек вида [[lat1,lng1],[lat2,lng2],...]
    * @return latlngs массив объектов latLng библиотеки leaflet 
    **/
	dots2latlngs: 	function (dots){
		latlngs = new Array();
		for ( var i = 0; i < dots.length; i++ ) latlngs.push(L.latLng(dots[i][0],dots[i][1]));
		return latlngs;
	},//end func

	
	/**
    * перемещение маркера по пути с анимацией
    * @param regiment объект юнита (полка)
    * @param route путь, представленный в виде массива точек вида [[lat1,lng1],[lat2,lng2],...]
    * @param i номер отрезка пути 
    **/
    moveMarkerRouteAnimation:	function (regiment,route,i){
        if (!Move.ENABLED) return false;
        if (route.length == 0) return false;
        if ( regiment.STOP ){
		    regiment.STOP = false;
            regiment.MOVE = false;
            regiment.path.setLatLngs([]);
            return false;
		}
        if ( regiment.status.kind == 'defense' ){
            return false; /*при обороне не можем двигаться*/
        }
		
		if ( i == undefined ) {
			i = 0;
			if ( regiment.path.getLatLngs().length == 0 )
				regiment.path.setLatLngs(Move.dots2latlngs(route)); //отрисовка пути движения полилинией
		}
		
		Move.moveMarkerLineAnimation({lat: route[i][0],lng: route[i][1]}, regiment, function(){
			if ( ++i < route.length ){
				Move.moveMarkerRouteAnimation(regiment,route,i);
			}
			else
			{
				regiment.path.setLatLngs([]); //удаление линии пути
			}
		
		});	
	},//end func
							
			
    /**
    * перемещение маркера в заданную точку по прямой с анимацией
    * @param latlng точка назначения в виде оъекта {lat:lat,lng:lng} 
    * @param regiment объект юнита (полка)
    * @param callback функция обратного вызова вызываемая после завершения движения 
    **/
	moveMarkerLineAnimation:	function ( latlng, regiment, callback ){
        if ( regiment.MOVE ) return false;
		regiment.MOVE = true;
		var start = regiment.marker.type.getLatLng();
		var end = latlng;
        var k = Move.DELTA_TIME / 399600000; /*коэф. для перевода км/м в градусы*/
		var R = Math.sqrt((start.lat - end.lat)*(start.lat - end.lat) + (start.lng - end.lng)*(start.lng - end.lng));
		var deltaLat = ( end.lat - start.lat ) / R * regiment.getVelocity() * k;
		var deltaLng = ( end.lng - start.lng ) / R * regiment.getVelocity() * k;
		var i = 0;
		var pos = L.latLng( start.lat, start.lng );
		var interval = setInterval( function(){
            
            if ( Math.abs( pos.lat - end.lat ) >= regiment.getVelocity() * k &&  Math.abs( pos.lng - end.lng ) >= regiment.getVelocity() * k && Move.ENABLED && !regiment.STOP )
			{
                if ( !Move.PAUSE ){
                    for ( marker in regiment.marker ) regiment.marker[marker].setLatLng( pos );
                    pos = L.latLng( pos.lat + deltaLat, pos.lng + deltaLng );
                    console.log((pos.lat + deltaLat)+':' + (pos.lng + deltaLng));
				}
                
			}
			else
			{
				clearInterval( interval );
				regiment.MOVE = false;
				callback();
			}
		
		}, Move.DELTA_TIME );
	},//end func
                            
                            
    /**
    * перемещение маркера в заданную точку по прямой без анимации
    * @param latlng координаты заданной точки в виде массива [lat,lng]
    * @param regiment объект юнита (полка)
    **/
    replaceMarker:    function(latlng,regiment){
        var pos = L.latLng(latlng[0],latlng[1]);
        for ( marker in regiment.marker ) regiment.marker[marker].setLatLng( pos );
    }//end func
							
}