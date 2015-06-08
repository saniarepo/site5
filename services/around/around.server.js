/*сервер расчета окружения*/
var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8001;
var spatialite = require('./spatialite3');
var Helper = require('./helper');
var time = require('./time');
var bodyParser = require('body-parser');

server.listen(port,function(){
    console.log('Around server start at port '+port+ ' ' + Helper.getTime());
});



app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));

/*маршрут для получения команды инициализации модуля spatialite*/
app.post('/init',function(req,res){
    var db_file = req.body.data;
    spatialite.init(db_file,function(){
   	    console.log('server: spatialite ready ');
        res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(true));
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
	time.start();
	spatialite.findRouteToBases(source, targets, enemy, function(result){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();
	});
     
});

/*маршрут для POST запроса к модулю spatialite для вычисления окружения юнитов*/
app.post('/around',function(req,res){
    var regiments = JSON.parse(req.body.regiments);
	var bases = JSON.parse(req.body.bases);
	time.start();
	spatialite.around(regiments, bases, function(result){
		console.log('Around Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();
	});
     
});


