/**
* конструктор клиентского объекта игры Game
* @param user клиентский объект user
**/
function Game( user )
{
	this.id = 0; /*идентификатор*/
    this.user = user; /*поле для хранения объекта user*/
    this.country = null; /*выбранная страна за которую играет игрок*/
    this.mission = null; /*выбранная миссия*/
    this.regimentId = 0; 
	this.baseId = 0;
	this.regiments = []; /**массив полков*/
	this.bases = [];     /*массив баз*/
    this.interval = null; /*переменная для хранения интервала*/
    this.start = false;  /*флаг состояния игры*/
    
    /*запуск инициализации объектов полков*/
    this.initRegiments = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) this.regiments[i].init();
	};
	
    /*запуск инициализации объектов баз*/
	this.initBases = function(){
		for ( var i = 0; i < this.bases.length; i++ ) this.bases[i].init();
	};
	
     /*установка всех полков и баз в состояние unselect*/
	this.unselectAll = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) this.regiments[i].unselect();
		for ( var i = 0; i < this.regiments.length; i++ ) this.bases[i].unselect();
	};
	
    /*установка всех полков в состояние unselect*/
	this.unselectRegiments = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) this.regiments[i].unselect();
	};
	
    /*установка всех полков и баз противника в состояние unselect*/
    this.unselectNotOwn = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) if ( !this.regiments[i].OWN ) this.regiments[i].unselect();
        for ( var i = 0; i < this.bases.length; i++ ) if ( !this.bases[i].OWN ) this.bases[i].unselect();
    };
    
    /*установка всех баз в состояние unselect*/
	this.unselectBases = function(){
		for ( var i = 0; i < this.bases.length; i++ ) this.bases[i].unselect();
	};
    
    /*вызов методов обновления юнитов игры*/
    this.updateUnits = function(){
        for ( var i = 0; i < this.regiments.length; i++ ){
            this.regiments[i].update();
        }
        for ( var i = 0; i < this.bases.length; i++ ){
            this.bases[i].update();
        }  
    };
    
	
    /**
    * создание полка
    * @param latlng координаты [lat,lng]
    * @param country строковый идентификатор страны
    * @type строка указывающая тип объекта
    **/
	this.createRegiment = function( latlng, country, type ){
		regiment = new RegimentBase(  L.latLng(latlng[0],latlng[1]), this.regimentId++ ); 
        for ( key in Countries ){
            if ( key == country ) regiment.country =  Countries[key][0];   
        }
        regiment.OWN = ( this.country.id == regiment.country.id )? true:false;
        if ( this.country.id != regiment.country.id ) regiment.userId = 0;
        regiment.type = getType(type);
        this.regiments.push(regiment);
		delete regiment;
		this.initRegiments();
	};
	
    /**
    * создание базы снабжения
    * @param latlng координаты [lat,lng]
    * @param country строковый идентификатор страны
    * @type строка указывающая тип объекта
    **/
	this.createSupplyBase = function( latlng, country, type ){
		base = new SupplyBase( L.latLng(latlng[0],latlng[1]), this.baseId++ ); 
        for ( key in Countries ){
            if ( key == country ) base.country =  Countries[key][0];   
        }
        base.OWN = ( this.country.id == base.country.id )? true:false;
        if ( this.country.id != base.country.id ) base.userId = 0;
        base.type = new Base();
		this.bases.push(base);
		delete base;
		this.initBases();	
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
    * уничтожение полка
    * @param id полка
    **/
	this.deleteRegiment = function(id){
		for ( var i = 0; i < this.regiments.length; i++ ) if ( this.regiments[i].id == id ){
			this.regiments[i].destroy();
			delete this.regiments[i];
			this.regiments.splice(i,1);
		}
	};
	
    /**
    * уничтожение базы снабжения
    * @param id базы снабжения
    **/
	this.deleteBase = function(id){
		for ( var i = 0; i < this.bases.length; i++ ) if ( this.bases[i].id == id ){
			this.bases[i].destroy();
			delete this.bases[i];
			this.bases.splice(i,1);
		}
	};
	
    /**
    * установка страны за которую выбрал играть игрок
    * @param country объект страны
    **/
    this.selectCountry = function(country){
        this.country = country;
    };
    
    /**
    * установка миссии в которую выбрал играть игрок
    * @param mission объект миссии
    **/
    this.selectMission = function(mission){
        this.mission = mission;  
    };
    
    /**
    * игровой цикл в котором происходит отправка данных на сервер
    * @param object объект игры
    **/
	this.loop = function(object){
        for ( var i = 0; i < object.regiments.length; i++ ) object.regiments[i].update();
		for ( var i = 0; i < object.bases.length; i++ ) object.bases[i].update();
        sendDataToServer();
	};
    
    /**
    * инициализация клиентского объекта игры
    * создание создание оюъектов игровых юнитов на основе
    * данных миссии и страны
    * @param callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.init = function(callback){
        
        var regiments = this.mission.regiments;
        var bases = this.mission.bases;
        for ( var i =0; i < regiments.length; i++ ) 
            this.createRegiment( regiments[i].latlng, regiments[i].country, regiments[i].type ); 
        for ( var i =0; i < bases.length; i++ ) 
            this.createSupplyBase( bases[i].latlng, bases[i].country, bases[i].type ); 
        
        this.start = false;
        Move.ENABLED = false;
        callback();
    };
    
    /**
    * клонирование клиентского объекта игры из принятого серверного объекта игры
    * @param remoteGame принятый серверный объект игры
    * @param callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.clone = function(remoteGame,callback){
        this.destroyAll();
        var regiments = remoteGame.regiments;
        var bases = remoteGame.bases;
        for ( var i =0; i < regiments.length; i++ ) 
            this.createRegiment( regiments[i].latlng, regiments[i].country.id, regiments[i].type.id ); 
        for ( var i =0; i < bases.length; i++ ) 
            this.createSupplyBase( bases[i].latlng, bases[i].country.id, bases[i].type.id ); 
        this.id = remoteGame.id;
        this.regimentId = remoteGame.regimentId;
        this.baseId = remoteGame.baseId;
        this.start = false;
        Move.ENABLED = false;
        callback();
    };
    
    /**
    * востановление клиентского объекта игры из принятого серверного объекта игры
    * @param remoteGame принятый серверный объект игры
    * @param callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.restore = function(remoteGame,callback){
        this.destroyAll();
        var regiments = remoteGame.regiments;
        var bases = remoteGame.bases;
        for ( var i =0; i < regiments.length; i++ ) 
            this.createRegiment( regiments[i].latlng, regiments[i].country.id, regiments[i].type.id ); 
        for ( var i =0; i < bases.length; i++ ) 
            this.createSupplyBase( bases[i].latlng, bases[i].country.id, bases[i].type.id ); 
        this.id = remoteGame.id;
        this.regimentId = remoteGame.regimentId;
        this.baseId = remoteGame.baseId;
        this.start = false;
        Move.ENABLED = false;
        this.startGame();
        callback();
    };
    
    /**
    * установка игры на паузу
    **/
    this.pauseGame = function(){
        
        if ( this.interval != null && this.start ){
            clearInterval(this.interval);
            this.interval = null; 
            this.start = false;
            Move.PAUSE = true;  
        }
    };
    
    /**
    * старт игры
    **/
    this.startGame = function(){
        if ( this.interval == null && !this.start ){
            this.start = true;
            Move.ENABLED = true;
            Move.PAUSE = false;
            this.interval = setInterval( this.loop ,1000, this );
        }
    };
    
    /**
    * уничтожение клиентского объекта игры
    * @param callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.destroy = function(callback){
        clearInterval(this.interval);
        this.start = false;
        Move.ENABLED = false;
        this.destroyAll();
        callback();
    };
    
    /**
    * уничтожение объектов полков и баз
    **/
    this.destroyAll = function(){
        while( this.regiments.length != 0 ){
            this.regiments[0].destroy();
            delete this.regiments[0];
            this.regiments.splice(0,1);
        }
        
        while( this.bases.length != 0 ){
            this.bases[0].destroy();
            delete this.bases[0];
            this.bases.splice(0,1);
        }
    };
    
    /**
    * преобразование в объекта игры в строку
    **/
    this.toString = function(){
        var game = {};
        game.id = this.id;
        game.user = this.user.toString();
        game.regimentId = this.regimentId;
    	game.baseId = this.baseId;  
        game.start = this.start;
        game.regiments = [];
    	game.bases = [];
        game.mission = this.mission;
        for ( var i = 0; i < this.regiments.length; i++ ) game.regiments.push(this.regiments[i].toString()); 
        for ( var i = 0; i < this.bases.length; i++ ) game.bases.push(this.bases[i].toString());
        return game;
    };
    
    /**
    * синхронизировать ли заданный параметр юнита в клиентском объекте game
    * с объектом game с сервера
    * @param param строка с названием параметра
    * @return true/false
    **/
    this.isSyncParamFromServer = function(param){
        var syncParams = ['around', 'elevation', 'battle' ];
        return ( syncParams.indexOf(param) != -1 )? true : false;
    };
    
    /**
    * синхронизация объекта игры с серверным объектом игры
    * @param game серверный объект игры
    **/
    this.sync = function(game){
        //console.log('client='+this.regiments.length+'; server='+game.regiments.length);
        var actualGame = ( this.id == game.id && 
        ( this.user.id == game.users[0].id || this.user.id == game.users[1].id ));
        //console.log(JSON.stringify(game.regiments));
        //console.log(JSON.stringify(Missions));
        if ( actualGame ){
            /*движение полков противника*/
            for ( var i = 0; i < this.regiments.length; i++ ){
                if (game.regiments[i] == undefined) continue;
                var foreignAndCorrect = ( game.regiments[i].userId != this.user.id &&
                    game.regiments[i].id == this.regiments[i].id );
                if ( foreignAndCorrect ) {
                    this.regiments[i].replace( game.regiments[i].latlng );
                } 
            }
            
            /*движение баз противника*/
            for ( var i = 0; i < this.bases.length; i++ ){
                 if (game.bases[i] == undefined) continue;
                var foreignAndCorrect = ( game.bases[i].userId != this.user.id &&
                    game.bases[i].id == this.bases[i].id );
                if ( foreignAndCorrect ){
                    this.bases[i].replace( game.bases[i].latlng );
                }
            }
            
            /*синхронизация  полков*/
            for ( var i = 0; i < this.regiments.length; i++ ){
                if (game.regiments[i] == undefined) continue;
                var corresponding = this.regiments[i].id == game.regiments[i].id;
                if (corresponding){
                    
                    this.regiments[i].lastelevation = this.regiments[i].elevation;
                    for ( param in game.regiments[i] ){
                        if ( this.isSyncParamFromServer(param) ){
                            this.regiments[i][param] = game.regiments[i][param];
                        }
                    }
                    this.regiments[i].type.resources = game.regiments[i].type.resources;  
                } 
            }
            
            /*синхронизация  баз*/
            for ( var i = 0; i < this.bases.length; i++ ){
                if (game.regiments[i] == undefined) continue;
                var corresponding = this.bases[i].id == game.bases[i].id;
                if (corresponding){
                    /*база стала окружена*/
                    if ( !this.bases[i].around && game.bases[i].around ){
                        createGameMessage(getGameMsg('beginAround', this.bases[i]));
                    }
                    /*база перестала быть окружена*/
                    if ( this.bases[i].around && !game.bases[i].around ){
                        createGameMessage(getGameMsg('endAround', this.bases[i]));
                    }
                    this.bases[i].lastelevation = this.bases[i].elevation;
                    for ( param in game.bases[i] ){
                        if ( this.isSyncParamFromServer(param) ){
                            this.bases[i][param] = game.bases[i][param];
                        }
                    } 
                    this.bases[i].type.resources = game.bases[i].type.resources; 
                } 
            }
            
            
        }//end if actualGame
        
        /*обновление юнитов игры*/
        this.updateUnits();
        //console.log(JSON.stringify(this.mission));
        //console.log(JSON.stringify(Missions));  
    };
       
}//end Game