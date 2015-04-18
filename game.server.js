/*игровой сервер*/
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8000;
var Helper = require('./modules/helper');
var sdata = require('./modules/sdata');
var controller = require('./modules/controller');
global.sdata = sdata;
global.helper = Helper;
var Handler = require('./modules/handler');
var cons = require('consolidate');

server.listen(port,function(){
    console.log('Game server start at port '+port+ ' ' + Helper.getTime());
});

/* настройки для рендеринга шаблонов*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views',__dirname+'/public/views');

/* подключение каталога статических файлов, cookies, bodyParser */
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

/*основной маршрут*/
app.get('/', controller.index );

/*URL для запроса конструктора миссий*/
app.get('/construct', controller.construct);

/*URL для запроса из конструктора миссий на создание файла миссий*/
app.post('/makemissions', controller.makemissions);

/*обработчики событий модуля socket.io*/
io.on('connection',function(socket){
    Handler.game_init_client(socket, sdata);
    Handler.game_clone_client(socket, sdata);
    Handler.game_data_from_client(socket,sdata);
    Handler.game_pause(socket,sdata);
    Handler.game_start(socket,sdata);
    Handler.game_exit(socket,sdata);
    Handler.get_missions(socket,sdata);
    Handler.connect(socket, sdata);
    Handler.get_game(socket, sdata);
    Handler.user_live(socket, sdata);
    Handler.check_around(socket, sdata);
    Handler.update_elevation(socket, sdata);
    Handler.update_weather(socket, sdata);
    Handler.get_game_message_client(socket, sdata);   
});
