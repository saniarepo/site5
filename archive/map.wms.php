<html>
<head>
  <title>OpenLayers Example</title>
    
	<script src="/js/OpenLayers-2.13.1/OpenLayers.js"></script>
    </head>
    <body>
      <div style="width:100%; height:100%" id="map"></div>
	  
	  <script type="text/javascript">
		var map = new OpenLayers.Map('map');
		var wms = new OpenLayers.Layer.WMS("NASA Global Mosaic",
                                   "http://wms.jpl.nasa.gov/wms.cgi",
                                   {layers: "basic"});
	   map.addLayer(wms);
		map.zoomToMaxExtent();
	  </script>
    </body>
</html>