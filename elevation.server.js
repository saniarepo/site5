var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = 8002;
var elevation= require('./modules/sqlite3.el.srv/elevation');
var Helper = require('./modules/sqlite3.el.srv/helper');
var time = require('./modules/sqlite3.el.srv/time');
var bodyParser = require('body-parser');

server.listen(port, function(){
	console.log('Elevation service start at port '+port+ ' ' + Helper.getTime());
});

app.use(express.static(__dirname+'/elevation/public'));
app.use(bodyParser.urlencoded({ extended: false }));

/*маршрут для POST запроса высоты точки из базы el2.sqlite; формат запроса data=[lat,lng]*/
app.post('/elevation',function(req,res){
	var data = JSON.parse(req.body.data);
	//time.start();
	elevation.getElevation(data, function(result){
		//console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();
	}); 
});

/*маршрут для POST запроса высот массива точек из базы el2.sqlite; формат запроса data=[[lat1,lng1],[lat2,lng2],...]*/
app.post('/elevations',function(req,res){
	var data = JSON.parse(req.body.data);
	//console.log(data);
    //time.start();
	elevation.getElevations(data, function(result){
		//console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		//console.log('el:'+JSON.stringify(result));
        res.write(JSON.stringify(result));
		res.end();
	}); 
});
