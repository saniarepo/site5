/*сервер маршрутов*/
var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8003;
var osrm = require('./osrm.route');
var Helper = require('./helper');
var time = require('./time');
var bodyParser = require('body-parser');

server.listen(port,function(){
    console.log('Route server start at port '+port+ ' ' + Helper.getTime());
});



app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));


/*маршрут для GET запроса маршрута от модуля OSRM*/
app.get('/routeosrm',function(req,res){
	var data = JSON.parse(req.query.data);
	var source = data[0];
	var target = data[1];
	var waypoints = [];
	time.start();
	osrm.getRoute(source, target, waypoints, function(route){
		console.log('Route OSRM Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write(JSON.stringify(route));
		res.end();	
	});
});


/*маршрут для GET запроса маршрута от модуля spatialite*/
app.get('/routespatialite',function(req,res){
    var data = JSON.parse(req.query.data);
	var source = data[0];
	var target = data[1];
    var from = {lat:source[0],lng:source[1]};
	time.start();
	spatialite.routeQuery(from, target, function(route){
		console.log('Route Spatialite Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});




