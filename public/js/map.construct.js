    /**
    * создание объекта карты и слоев с тайлами
    * используя библиотеку leaflet http://leafletjs.com/
    **/
	var mapCenter = [56.605, 47.9]; /*центр карты*/
	var zoom = 13;                  /*масштаб*/
	var maxZoom = 20;               /*максимальный масштаб*/
    var minZoom = 1                /*минимальный масштаб*/
	var id = 'examples.map-zr0njcqy'; /*ключ*/
	var map = null;


	map = L.map('map').setView( mapCenter, zoom );

	/*создаем tile-слой*/ 
	var mapbox = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		maxZoom: maxZoom,
        minZoom: minZoom,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: id
	});
	/*создаем tile-слой*/ 
    var Thunderforest_Landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
   
   /*создаем tile-слои Google*/ 
   var ggl = new L.Google('SATELLITE',{maxZoom: maxZoom, minZoom: minZoom});
   var ggl2 = new L.Google('TERRAIN',{maxZoom: maxZoom, minZoom: minZoom});
    
	/*создаем другие базовые слои от других провайдеров*/     
	var osmde = L.tileLayer.provider('OpenStreetMap.DE',{maxZoom: maxZoom, minZoom: minZoom});
	var osmBW = L.tileLayer.provider('OpenStreetMap.BlackAndWhite',{maxZoom: maxZoom, minZoom: minZoom}).addTo(map);
	var ersiwi = L.tileLayer.provider('Esri.WorldImagery',{maxZoom: maxZoom, minZoom: minZoom});
	/*создаем контрол для переключения слоев*/
	var baseLayers = 	{
							"OpenStreetMap": osmde,
                            "Mapbox": mapbox,
							"OpenStreetMap Black and White": osmBW,
                            "Thunderforest.Landscape": Thunderforest_Landscape,
							"Esri WorldImagery": ersiwi,
                            "Google Satellite": ggl,
                            "Google Terrain": ggl2
						};

	L.control.layers(baseLayers).addTo(map);