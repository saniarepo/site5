<html>
<head>
  <title>OpenLayers Example</title>
    <script src="/js/OpenLayers-2.13.1/OpenLayers.js"></script>
	<script src="/js/jquery-1.11.0.min.js"></script>
	<link type="text/css" rel="stylesheet" href="/css/style.css"/>
    </head>
    <body>
      <div style="width:100%; height:100%" id="map"></div>
	  
	  <button id="marker">Маркер</button>
	  
	  <script type="text/javascript">
	
        var map, layer;
       
            map = new OpenLayers.Map( 'map');
            layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
            map.addLayer(layer);
            map.setCenter(
                new OpenLayers.LonLat(56.540223, 47.583858).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                ), 8
            );    
        
		
		var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
			var feature = new OpenLayers.Feature.Vector(
			 new OpenLayers.Geometry.Point(56.540223, 47.583858),
			 {some:'data'},
			 {externalGraphic: image, graphicHeight: 21, graphicWidth: 16});
			vectorLayer.addFeatures(feature);
			map.addLayer(vectorLayer);
		
		function setMarker(map,lat,lng,image){
			var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
			var feature = new OpenLayers.Feature.Vector(
			 new OpenLayers.Geometry.Point(lat, lng),
			 {some:'data'},
			 {externalGraphic: image, graphicHeight: 21, graphicWidth: 16});
			vectorLayer.addFeatures(feature);
			map.addLayer(vectorLayer);
			
		}
		
		$(document).ready(function(){
			$('#marker').click(function(){
				setMarker(map,56.54,47.58,'/img/tree.png');
			});
		
		
		
		
		});
		
    </script>
    </body>
</html>