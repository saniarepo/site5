<html>
<head>
  <title>OpenLayers Example</title>
    <script src="/js/OpenLayers-2.13.1/OpenLayers.js"></script>
	<script src="/js/jquery-1.11.0.min.js"></script>
	<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
	<link type="text/css" rel="stylesheet" href="/css/style.css"/>
    </head>
    <body>
      <div style="width:100%; height:100%" id="map"></div>
	  <script type="text/javascript">
		
		
		var map = new OpenLayers.Map({
        div: "map",
        projection: "EPSG:4326",
        displayProjection: "EPSG:4326",
        numZoomLevels: 18,
        // approximately match Google's zoom animation
        zoomDuration: 10
    });
	
	
    // create Google Mercator layers
    var gphy = new OpenLayers.Layer.Google(
        "Физическая карта",
        {type: google.maps.MapTypeId.TERRAIN}
    );
	/*	
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets", // the default
        {numZoomLevels: 20}
    );
	*/
    var ghyb = new OpenLayers.Layer.Google(
        "Гибрид",
        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
    );
	
    var gsat = new OpenLayers.Layer.Google(
        "Спутник",
        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
    );
	
	var mapnik = new OpenLayers.Layer.OSM();
	
	var vector = new OpenLayers.Layer.Vector("Editable Vectors");
	/*
    // create Bing layers

    // API key for http://openlayers.org. Please get your own at
    // http://bingmapsportal.com/ and use that instead.
    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

    var veroad = new OpenLayers.Layer.Bing({
        key: apiKey,
        type: "Road",
        wrapDateLine: true
    });
    var veaer = new OpenLayers.Layer.Bing({
        key: apiKey,
        type: "Aerial",
        wrapDateLine: true
    });
    var vehyb = new OpenLayers.Layer.Bing({
        key: apiKey,
        type: "AerialWithLabels",
        wrapDateLine: true
    });

    // create OSM layers
    var mapnik = new OpenLayers.Layer.OSM();

    // create a vector layer for drawing
    

    map.addLayers([
        gphy, gmap, gsat, ghyb, veroad, veaer, vehyb, mapnik, vector
    ]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.EditingToolbar(vector));
   
    map.addControl(new OpenLayers.Control.MousePosition());
    */
	
	
	
	map.addLayers([gphy,ghyb,gsat,mapnik,vector]);
	
	map.addControl(new OpenLayers.Control.MousePosition());
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	//map.addControl(new OpenLayers.Control.EditingToolbar(vector));
	// map.addControl(new OpenLayers.Control.Permalink());
	map.zoomToMaxExtent();

	//работа с маркерами
	var markers = new OpenLayers.Layer.Markers('markers');
	map.addLayer(markers);
	var size = new OpenLayers.Size(21,25);
	//var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var icon = new OpenLayers.Icon('/img/tree.png', size );
	var marker = new OpenLayers.Marker(new OpenLayers.LonLat(40,40),icon);
	markers.addMarker(marker);
	setTimeout(function(){markers.removeMarker(marker);},5000);
	
	
	
    </script>
	   
	
    </body>
</html>