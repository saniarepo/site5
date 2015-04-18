/*конструктор серверного объекта Game*/
var Helper = require('./helper');
var Battle = require('./battle');

function Game()
{
    this.id = 0; /*id игры*/
    this.ready = false; /*флаг готовности игры*/
    this.users = []; /*массив игроков*/ 
    this.status = ''; /*состояние игры*/
    this.regiments = []; /*массив полков*/
    this.bases = []; /*массив баз*/
    this.mission = null; /*текущая миссия*/
    this.MAX_LIVE_TIMEOUT = 13000; /*время в мс по истечении которого если от любого юзера нет события user_live игра прекращается*/
    this.setId = function(){
        this.id = Helper.getRandomInt(1000000,2000000);    
    };
    this.logMessages = []; /*массив лог-сообщений*/
    this.gameMessages = []; /*массив игровых сообщений*/
    this.MAX_LOG_MESSAGES = 10; /*максимальное количество лог-сообщений*/
    this.MAX_GAME_MESSAGES = 20;/*максимальное количество игровых сообщений*/
    
    /**
    * установка флага игры
    * @param ready флаг
    **/
    this.setReady = function(ready){
        this.ready = ready;
    }
    
    /**
    * присоединение игрока к игре
    * @param user объект User
    **/
    this.joinUser = function(user){
        for ( var i = 0; i < this.users.length; i++ ){
            if ( this.users[i].id == user.id ){
                this.users[i] = user;
                return true; 
            }
        }
        if ( this.users.length < 2 ){
            var now = new Date();
            user.lastTime = now.getTime();
            this.users.push(user);
        } 
        
        if ( this.users.length > 1 ){
            this.setReady(true);
        }
    };
    
    /**
    * получение имени user по id
    * @param userId id
    * @return id или undefined 
    **/
    this.getUserName = function(userId){
        for ( var i = 0; i < this.users.length; i++ ){
            if ( this.users[i].id == userId ) return this.users[i].name;
        }
        return null;
    }
    
    /**
    * инициализация игры при начале игры первым клиентом
    * @param game объект Game принятый от клиента инициализировавшего игру
    * callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.init = function(game,callback){
        this.regiments = game.regiments;
        this.bases = game.bases;
        this.mission = game.mission;
        callback();
    };
    
    /**
    * клонирование игры при присоединении к игре второго игрока  
    * @param game объект Game принятый от клиента инициализировавшего игру
    * callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.clone = function(game,callback){
        for ( var i = 0; i < this.regiments.length; i++ ){
            if ( this.regiments[i].userId == 0 && this.regiments[i].id == game.regiments[i].id ){
                this.regiments[i].userId = game.regiments[i].userId;
            }
        }
        for ( var i = 0; i < this.bases.length; i++ ){
            if ( this.bases[i].userId == 0 && this.bases[i].id == game.bases[i].id ){
                this.bases[i].userId = game.bases[i].userId;
            }
        }
        
        for ( var i = 0; i < this.users.length; i++ ){
            this.users[i].gameId = this.id;
        }
        
        callback();
    };
    
    /**постановка игры на паузу
    * @param user объект user от клиента
    **/
    this.pause = function(user){
        this.setReady(false);  
    };
    
    /**старт игры
    * @param user объект user от клиента
    **/
    this.start = function(user){
        this.setReady(true);
    }
    
    /**
    * завершение игры, уничтожение серверного объекта Game  
    * callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.exit = function(callback){
        this.setReady(false);
        while( this.regiments.length != 0 ){
            delete this.regiments[0];
            this.regiments.splice(0,1);
        }
        
        while( this.bases.length != 0 ){
            delete this.bases[0];
            this.bases.splice(0,1);
        }
        
         while( this.users.length != 0 ){
            delete this.users[0];
            this.users.splice(0,1);
        }
        delete this.mission;
        callback();  
    };
    
    /**
    * синхронизировать ли заданный параметр юнита в серверном объекте game
    * с объектом game с клиента
    * @param param строка с названием параметра
    * @return true/false
    **/
    this.isSyncParamFromClient = function(param){
        var syncParams = ['latlng', 'status', 'country'];
        return ( syncParams.indexOf(param) != -1 )? true : false;
    };
    
    /**
    * синхронизация серверного объекта Game с клиентским 
    * @param game объект Game принятый от клиента для синхронизации
    **/
    this.sync = function(game){
        if ( !this.ready ) return false;
        
        /*уничтожение отсутсвующих в клиентском объекте полков*/
        var i = 0;
        while( i < this.regiments.length ){
            var unitPresent = false;
            for ( var j = 0; j < game.regiments.length; j++ ){
                if ( this.regiments[i].id == game.regiments[j].id ) unitPresent = true;
            }
            if ( !unitPresent ){
                this.addGameMessage(this.gameMsgText('unitKilled',this.regiments[i]));
                delete this.regiments[i];
                this.regiments.splice(i,1);
            }else{
                i++;
            }
        }
        
        /*уничтожение отсутсвующих в клиентском объекте баз*/
        var i = 0;
        while( i < this.bases.length ){
            var unitPresent = false;
            for ( var j = 0; j < game.bases.length; j++ ){
                if ( this.bases[i].id == game.bases[j].id ) unitPresent = true;
            }
            if ( !unitPresent ){
                this.addGameMessage(this.gameMsgText('unitKilled',this.regiments[i]));
                delete this.bases[i];
                this.bases.splice(i,1);
            }else{
                i++;
            }
        }
        
        /*синхронизация полков*/ 
        for ( var i = 0; i < this.regiments.length; i++ ){
            var correct = ( 
                this.regiments[i].id == game.regiments[i].id &&
                game.regiments[i].OWN == true &&
                this.regiments[i].userId == game.user.id
            );
            if ( correct ){
                for ( param in game.regiments[i] ){
                    if ( this.isSyncParamFromClient(param) ){
                        this.regiments[i][param] = game.regiments[i][param];
                    }
                }
            }
        }
        /*синхронизация  баз*/
        for ( var i = 0; i < this.bases.length; i++ ){
            var correct = ( 
                this.bases[i].id == game.bases[i].id &&
                game.bases[i].OWN == true &&
                this.bases[i].userId == game.user.id
            );
            if ( correct ){
                for ( param in game.bases[i] ){
                    if ( this.isSyncParamFromClient(param) ){
                        this.bases[i][param] = game.bases[i][param];
                    }       
                }
            }
        }
    };
    
    this.battleLoop = function(){
        Battle.perform(this);  
    };
    
    /**
    * обновление времени последнего поступления от клиента игрока сигнала об активности  
    * @param user объект user от клиента
    **/
    this.userLive = function (user){
        for ( var i = 0; i < this.users.length; i++ ){
            if ( this.users[i].name == user.name && this.users[i].id == user.id ){
                var now = new Date();
                //console.log('name='+this.users[i].name+'; last='+this.users[i].lastTime+'; now='+now.getTime()+ '; deltatime='+(now.getTime()-this.users[i].lastTime));
                this.users[i].lastTime = now.getTime();
                
            }
        }
    };
    
    /**
    * проверка что время от последнего поступления от клиентов игроков 
    * сигнала об активности не превышает заданного порога
    * @return true если время не превышает порога или false в противном случае  
    **/
    this.isUsersLive = function(){
        var now = new Date();
        var nowTime = now.getTime();
        for ( var i = 0; i < this.users.length; i++ ){
            if ( (( nowTime - this.users[i].lastTime ) > this.MAX_LIVE_TIMEOUT) && (( nowTime - this.users[i].lastTime ) < this.MAX_LIVE_TIMEOUT * 10) ) return false;
        }
        return true;
    };
    
    /**
    * преобразование объекта в вид который может быть преобразован в строку
    * @return game преобразованный объект 
    **/
    this.toString = function(){
        var game = {};
        game.id = this.id;
        game.ready = this.ready;
        game.users = this.users; 
        game.status = this.status;
        game.regiments = this.regiments;
        game.bases = this.bases;
        return game;
    };
    
    /**
    * Возвращает объект полка по его id
    **/
    this.getRegiment = function(id){
        for ( var i = 0; i < this.regiments.length; i++ ){
            if ( this.regiments[i].id == id ) return this.regiments[i];
        }
        return null;  
    };
    
    /**
    * Возвращает объект базы по его id
    **/
    this.getBase = function(id){
        for ( var i = 0; i < this.bases.length; i++ ){
            if ( this.bases[i].id == id ) return this.bases[i];
        }
        return null;  
    };
    
    /**
    * добавление лог-сообщения
    * @param mess строка сообщения
    **/
    this.addLogMessage = function(mess){
        this.logMessages.unshift(mess);
        if ( this.logMessages.length > this.MAX_LOG_MESSAGES ){
            this.logMessages.pop();
        }  
    };
    
    /**
    * добавление игрового сообщения
    * @param mess строка сообщения
    **/
    this.addGameMessage = function(mess){
        var len = this.gameMessages.length;
        this.gameMessages.unshift(mess);
        if ( this.gameMessages.length > this.MAX_GAME_MESSAGES ){
            this.gameMessages.pop();
        }
        return true;
    };
    
    /**
    * возвращает лог-сообщения
    * @return массив строк сообщений
    **/
    this.getLogMessages = function(){
        return this.logMessages;   
    };
    
    /**
    * возвращает игровые сообщения
    * @return массив строк сообщений
    **/
    this.getGameMessages = function(){
        return this.gameMessages;   
    };
    
    /**
    * проверка окончания игры
    * если у ккакого-то игрока нет ни одного юнита игра закончена
    * @return true/false закончена/не закончена
    **/
    this.checkGameOver = function(){
        var gameOver = false;
        for ( var i = 0; i < this.users.length; i++ ){
            var unitCount = 0;
            for ( var j = 0; j < this.regiments.length; j++ ){
                if ( this.regiments[j].userId == this.users[i].id ) unitCount++;
            }
            
            for ( var j = 0; j < this.bases.length; j++ ){
                if ( this.bases[j].userId == this.users[i].id ) unitCount++;
            }
            if ( unitCount == 0 ){
                this.users[i].loser = true;
                gameOver = true;
            } 
        }
        return gameOver;
    };
    
    /**
    * возвращает текст игрового сообщения
    * @param msgId идентификатор сообщения
    * @param object объект юнита посылающий сообщение
    **/
    this.gameMsgText = function(msgId, object){
        var messages = {
            beginBattle: object.type.name + ' ' + object.id + ' ' +object.country.name + ' вступил в бой',
            endBattle: object.type.name + ' ' + object.id + ' ' +object.country.name + ' вышел из боя',
            beginAround: object.type.name + ' ' + object.id + ' ' +object.country.name + ' снабжение прервано',
            endAround: object.type.name + ' ' + object.id + ' ' +object.country.name + ' снабжение восстановлено',
            unitKilled: object.type.name + ' ' + object.id + ' ' +object.country.name + ' уничтожен',
            baseCaptured: object.type.name + ' ' + object.id + ' ' +object.country.name + ' захвачена противником'
        };
        
        return messages[msgId];
    };

    
}

exports.Game = Game;