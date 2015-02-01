/*сервер маршрутов*/
var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8001;
var spatialite = require('./modules/spatialite/spatialite');
var osrm = require('./modules/osrm.route');
var Helper = require('./modules/spatialite/helper');
var time = require('./modules/spatialite/time');
var bodyParser = require('body-parser');

server.listen(port,function(){
    console.log('Route service start at port '+port+ ' ' + Helper.getTime());
});



app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));

/*маршрут для получения команды инициализации модуля spatialite*/
app.post('/init',function(req,res){
    var db_file = req.body.data;
    console.log('server:db_file:'+db_file);
    spatialite.init(db_file,function(){
   	    console.log('server: spatialite ready ');
        res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(true));
		res.end();   
    });
});

/*маршрут для GET запроса маршрута от модуля OSRM*/
app.get('/routeosrm',function(req,res){
	var data = JSON.parse(req.query.data);
	var source = data[0];
	var target = data[1];
	var waypoints = [];
	time.start();
	osrm.getRoute(source, target, waypoints, function(route){
		console.log('Executing time: '+time.stop());
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
	time.start();
	spatialite.routeQuery(source, target, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});

/*маршрут для GET запроса маршрута от модуля spatialite через routeDijkstra*/
app.get('/routedijkstra',function(req,res){
    var data = JSON.parse(req.query.data);
	var source = data[0];
	var target = data[1];
	time.start();
	spatialite.routeDijkstra2(source, target, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});


/*маршрут для GET запроса маршрута от модуля spatialite через bypassingWide*/
app.get('/routebypassingwide',function(req,res){
    var data = JSON.parse(req.query.data);
	var source = data[0];
	var target = data[1];
	time.start();
	spatialite.bypassingWide(source, target, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});

/*маршрут для GET запроса маршрута от модуля spatialite через bypassingWideEnemy*/
app.get('/routebypassingwideenemy',function(req,res){
    var data = JSON.parse(req.query.data);
	var enemy = JSON.parse(req.query.enemy);
	var source = data[0];
	var target = data[1];
	time.start();
	spatialite.bypassingWideEnemy(source, target, enemy, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});


/*маршрут для GET запроса маршрута от модуля spatialite через routeWaveEnemy*/
app.get('/routewaveenemy',function(req,res){
	var data = JSON.parse(req.query.data);
	var enemy = JSON.parse(req.query.enemy);
	var source = data[0];
	var target = data[1];
	time.start();
	spatialite.routeWaveEnemy(source, target, enemy, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});

/*маршрут для POST запроса маршрута от модуля spatialite через getRouteToBases*/
app.post('/routetobases',function(req,res){
    var source = JSON.parse(req.body.source);
	var targets = JSON.parse(req.body.targets);
    var enemy = JSON.parse(req.body.enemies);
	//time.start();
	spatialite.findRouteToBases(0, source, targets, enemy, function(result){
		//console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();
	});
     
});


