/*серверный модуль обработчиков событий при взаимодействии клиентов и сервера*/
var parameters = require('./parameters').parameters;
var missions = require(parameters.missions_module).missions;
var around = require(parameters.services.around); /*подключение модуля окружения*/
var elevation = require(parameters.services.elevation); /*подключение модуля высот*/
var weather = require(parameters.services.weather); /*подключение модуля погоды*/


/**
* обработчик события инициализации игры клиентом
* создается и иниц. объект game, user
* генерация событий game_init_server, client_refresh_by_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function game_init_client(socket, sdata){
    socket.on('game_init_client',function(data){
        if (sdata.game != null){
            socket.emit('client_refresh_by_server');
            return;
        }
        sdata.game = new sdata.Game();
        sdata.game.setId();
        console.log('Game create id: '+sdata.game.id);
        sdata.game.joinUser(data.user);
        sdata.game.init(data.game,function(){
            sdata.addUser(data.user);
            socket.broadcast.emit('client_refresh_by_server');
            socket.emit('game_init_server',{gameId:sdata.game.id });
            sdata.game.addLogMessage('user '+data.user.name + ' init game');
            sendLogMessages(socket, sdata);
            console.log('user '+data.user.name + ' init game');
            around.init(data.game.mission.db_file, function(){
                socket.emit('around_ready');
                socket.broadcast.emit('around_ready');
            });  
        });  
    });
}

/**
* обработчик события клонирования игры присоединяющимся клиентом
* генерация событий game_clone_server, game_ready
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function game_clone_client(socket, sdata){
    socket.on('game_clone_client',function(data){
        if (sdata.game == null) return; 
        sdata.game.joinUser(data.user);
        sdata.game.clone(data.game,function(){
            sdata.addUser(data.user);
            socket.emit('game_clone_server',{gameId:sdata.game.id, msg:'user '+data.user.name + ' join to game'});
            sdata.game.addLogMessage('user '+data.user.name + ' join to game');
            sendLogMessages(socket, sdata);
            console.log('user '+data.user.name + ' join to game');
            if ( sdata.game.ready ){
                socket.emit('game_ready',{gameId: sdata.game.id});
                socket.broadcast.emit('game_ready',{gameId: sdata.game.id});
            }  
        });
        sendLogMessages(socket, sdata);          
    });
}

/**
* обработчик события получения данных от клиента для синхронизации
* объекта game
* генерация событий data_from_server и отправка данных клиенту для 
* синхронизации его объекта game с серверным объектом game
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function game_data_from_client(socket,sdata){
    socket.on('data_from_client',function(data){
        if ( sdata.game != null ){
            sdata.game.sync(data.game);
            if ( sdata.game.users[0].id == data.user.id ){
                sdata.game.battleLoop();
            }
            if ( !sdata.game.checkGameOver()){
                socket.emit('data_from_server',{game:sdata.game.toString()}); 
            }else{
                var won = ( sdata.game.users[0].loser )? sdata.game.users[1] : sdata.game.users[0];
                sdata.game.addLogMessage('Game over, user ' + won.name + ' won');
                sendLogMessages(socket, sdata);
                socket.emit('game_over',{won:won});
                socket.broadcast.emit('game_over',{won:won});
            }
        }
    });
}

/**
* обработчик события постановки игры на паузу одним из клиентов
* генерация событий game_pause_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function game_pause(socket, sdata){
    socket.on('game_pause_client',function(data){
        //console.log(data.msg+': '+JSON.stringify(data.user));
        socket.broadcast.emit('game_pause_server',{user:data.user});
        socket.emit('game_pause_server',{user:data.user});
        sdata.game.addLogMessage('game paused by user ' + data.user.name);
        sendLogMessages(socket, sdata);
    });
}

/**
* обработчик события старта игры
* генерация событий game_start_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function game_start(socket, sdata){
    socket.on('game_start_client',function(data){
        socket.broadcast.emit('game_start_server',{user:data.user});
        socket.emit('game_start_server',{user:data.user});
        sdata.game.addLogMessage('user ' + data.user.name + ' start game');
        sendLogMessages(socket, sdata);
    });
}

/**
* обработчик события выхода из игры
* обнуление объекта game, удаление объектов user
* генерация событий game_exit_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function game_exit(socket, sdata){
    socket.on('game_exit_client',function(data){
        //console.log(data.msg+': '+JSON.stringify(data.user));
        if (sdata.game == null) return;
        sdata.game.addLogMessage('game over by user ' + data.user.name);
        sendLogMessages(socket, sdata);
        sdata.game.exit(function(){
            sdata.game = null;
            sdata.clearUsers();
        });
        socket.broadcast.emit('game_exit_server');
        socket.emit('game_exit_server');   
    });
}

/**
* обработчик события запроса вариантов миссий клиентом 
* генерация событий send_missions и посылка данных о миссиях
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function get_missions(socket,sdata){
    socket.on('get_missions', function(data){
        if ( sdata.game == null ){
            socket.emit('send_missions',{missions:missions, isGameInit:false});
        }else{
            var mission = missions[sdata.game.mission.id];
            mission.country = getFreeCountry(sdata.game.regiments);
            socket.emit('send_missions',{missions:mission, isGameInit:true, remoteGame: sdata.game.toString() });
        }
        
    });
}

/**
* обработчик события запроса серверного объекта game клиентом 
* генерация событий send_game и посылка данных серверного объекта game
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function get_game( socket, sdata ){
   socket.on('get_game', function(data){
        if ( sdata.game == null ){
            socket.emit('send_game',{game: null, missions:missions, isGameInit:false});
        }else{
            var mission = missions[sdata.game.mission.id];
            mission.country = getUserCountry(sdata.game.regiments, data.user);
            socket.emit('send_game',{missions:mission, isGameInit:true, remoteGame: sdata.game.toString() });
        }
        sendLogMessages(socket, sdata);
        sendGameMessages(socket, sdata);
    }); 
    
}

/**
* обработчик события сигнала о активности, проверка что оба клиента игры
* живы и если нет, то обнуление серверного объекта game, удаление
* объктов user, и 
* генерация событий game_exit_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function user_live( socket, sdata ){
   socket.on('user_live', function(data){
        if ( sdata.game != null ){
            //console.log(JSON.stringify(data.user));
            sdata.game.userLive(data.user);
            //console.log(JSON.stringify(sdata.game.users));
            if ( !sdata.game.isUsersLive() ){
                sdata.game.addLogMessage('client was lost');
                console.log('client was lost');
                sendLogMessages(socket, sdata);
                sdata.game.exit(function(){
                    sdata.game = null;
                    sdata.clearUsers();
                });
                
                socket.broadcast.emit('game_exit_server');
                socket.emit('game_exit_server'); 
            }
        } 
    });   
}

/**
* обработчик события запроса клиента на запуск проверки факта окружения
* полка и установки соответсвующего поля объектов полков в серверном
* объекте game 
* генерация события check_around_done после окончания цикла проверки
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function check_around(socket,sdata){
    socket.on('check_around', function(data){
        if ( sdata.game == null ){
            socket.emit('check_around_done');
            return true;
        }
        if ( data.user.id == sdata.game.users[0].id ){
            around.setAround(sdata.game, function(){
                socket.emit('check_around_done');
            });
        }
    });
}

/**
* обработчик события запроса клиента на запуск 
* получения высотных данных для юнитов и обновление соответсвующего 
* поля объектов полков в серверном объекте game 
* генерация события check_around_done после окончания цикла проверки
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function update_elevation(socket,sdata){
    socket.on('update_elevation', function(data){
         if ( sdata.game == null ){
            socket.emit('update_elevation_done');
            return true;
        }
        if ( data.user.id == sdata.game.users[0].id ){
            elevation.updateElevation(sdata.game, function(){
                socket.emit('update_elevation_done');
            });
        }
    });
}

/**
* обработчик события запроса клиента на запуск 
* получения высотных данных для юнитов и обновление соответсвующего 
* поля объектов полков в серверном объекте game 
* генерация события check_around_done после окончания цикла проверки
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function update_weather(socket,sdata){
    socket.on('update_weather', function(data){
         if ( sdata.game == null ){
            socket.emit('update_weather_done');
            return true;
        }
        if ( data.user.id == sdata.game.users[0].id ){
            weather.updateWeather(sdata.game, function(){
                socket.emit('update_weather_done');
            });
        }
    });
}

/**
* обработчик события connect
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function connect(socket,sdata){
    socket.on('connect',function(data){
        socket.emit('connect',{msg:'connect!!!'});
    });
}

/**
* получение незанятой страны при присоединении к игре второго игрока
* @param regiments массив объектов regiment
* @return country_id или false 
**/
function getFreeCountry(regiments){
    for ( var i = 0; i < regiments.length; i++ ){
        if ( regiments[i].userId == 0 ) return regiments[i].country;
    }
    return false;
}

/**
* получение выбранной страны в миссии
* @param regiments массив объектов regiment
* @param user объект user
* @return country_id или false
**/
function getUserCountry(regiments,user){
    for ( var i = 0; i < regiments.length; i++ ){
        if ( regiments[i].userId == user.id ) return regiments[i].country;
    }
    return false;
}

/**
* отправка лог-сообщений по клиентам
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
* @param mess строка сообщения
**/
function sendLogMessages(socket, sdata ){
    var messages = sdata.game.getLogMessages();
    socket.emit('server_msg',{msg: messages});
    socket.broadcast.emit('server_msg',{msg: messages});
}


/**
* отправка игровых сообщений по клиентам
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
* @param mess строка сообщения
**/
function sendGameMessages(socket, sdata ){
    if (sdata.game == null) return;
    var messages = sdata.game.getGameMessages();
    socket.emit('server_game_msg',{msg: messages});
    //socket.broadcast.emit('server_game_msg',{msg: messages});
}

/**
* обработчик события запроса игрового сообщения клиентом
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
**/
function get_game_message_client(socket, sdata){
    socket.on('get_game_message_client', function(data){
        sendGameMessages(socket, sdata);
    });
}


exports.game_init_client = game_init_client;
exports.game_clone_client = game_clone_client;
exports.game_data_from_client = game_data_from_client;
exports.game_pause = game_pause;
exports.game_start = game_start;
exports.game_exit = game_exit;
exports.get_missions = get_missions;
exports.connect = connect;
exports.get_game = get_game;
exports.user_live = user_live;
exports.check_around = check_around;
exports.update_elevation = update_elevation;
exports.update_weather = update_weather;
exports.get_game_message_client = get_game_message_client;