var express = require('express');
var weather = require('./weather');
var app = express();
var server = require('http').Server(app);
var port = 8004;
var Helper = require('./helper');
var time = require('./time');
server.listen(port, function(){
		console.log('Weather server start at port '+port+ ' ' + Helper.getTime());
	});

app.use(express.static(__dirname+'/public'));


/*маршрут для получения справки*/
app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

/*маршрут для получения погоды в одной точке*/
/*принимает запрос вида http://site1.loc:8000/weather/?date=20140116&lat=56.4&lng=48.16*/
app.get('/weather',function(req,res){
    var date = req.query.date;
	var lat = req.query.lat;
	var lng = req.query.lng;
	time.start();
	weather.getWeather(date, lat, lng, function(result){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();	
	});
});


/*маршрут для получения погоды в нескольких точках*/
/*принимает запрос вида http://site1.loc:8080/weather/multi/?date=20140116&dots=56.12,47.67|58.17,49.11|54.13,48.32*/
app.get('/weather/multi',function(req,res){
	var date = req.query.date;
	var dots = req.query.dots;
	time.start();
	weather.getWeatherMulti(date, dots, function(result){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();	
	});
});



