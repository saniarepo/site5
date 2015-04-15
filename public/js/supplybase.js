/**
* конструктор объекта игрового юнита (базы)
* param latlng координаты [lat,lng]
* param id идентификатор
**/
function SupplyBase( latlng, id )
{
	/*Свойства*/
	this.id = id;              /*идентификатор*/
    this.userId = game.user.id;/*id игрока*/
	this.MOVE = false;/*флаг находится ли юнит в движении*/
    this.STOP = false; /*флаг сигнала на остановку*/
    this.OWN = false;/*флаг свой ли юнит*/
	this.selected = false;/*флаг что юнит выбран*/
    this.around = false;/*флаг что юнит окружен*/
    this.elevation = 0;/*высота точки нахождения юнита*/
    this.lastelevation = 0; /*предыдущая высота*/
	this.colorPath = 'red';/*цвет траектории пути*/
    this.battle = false; /*флаг боя*/
    this.lastbattle = false; /*предыдущее значение флага боя*/
    this.enemyCount = 0; /*количество противников*/
    this.weather = null; /*погодные данные*/
    this.status = 
    {
        kind: 'defense', /*статус юнита; может быть march, defense*/
        defense_coff: 0.5, /*степень ослабления ударов неприятеля в состоянии обороны*/
        attack_coff: 0.5, /*степень ослабления ударной мощи на марше*/
        speed_coff: 0.5  /*степень замедления скорости в атаке*/
    };
	this.popup = L.popup();/*объект всплывающего окна из leaflet http://leafletjs.com/*/
	this.path = L.polyline([],{color:this.colorPath}).addTo(map);/*объект полилинии пути движения*/
    this.country = /*объект иконки страны принадлежности*/
	{ 
		icon: 	L.icon({ iconUrl: '/img/default.png',
		iconSize: [24, 24], 
		iconAnchor: [12, 12], 
		shadowAnchor: [4, 23], 
		popupAnchor: [-3, -23]})
	};
	this.type =  /*объект иконки типа юнита*/ 
	{
		icon: L.icon({ iconUrl: '/img/default.png',
		iconSize: [24, 24], 
		iconAnchor: [12, 12], 
		shadowAnchor: [4, 23], 
		popupAnchor: [-3, -23]})
	};
    
    /*объект иконки выделенного юнита*/ 
	this.iconSelected = L.icon({ iconUrl: '/img/unselected.png',
					iconSize: [50, 50], 
					iconAnchor: [25, 25], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
    
    /*объект иконки невыделенного юнита*/ 
	this.iconUnselected = L.icon({ iconUrl: '/img/unselected.png',
					iconSize: [50, 50], 
					iconAnchor: [25, 25], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
                    
    /*объект иконки изображения боя*/
    this.iconBattle = L.icon({ iconUrl: '/img/battle.gif',
					iconSize: [60, 60], 
					iconAnchor: [30, 30], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
                    
    /*объект иконки изображения взрыва*/
    this.iconExplosion = L.icon({ iconUrl: '/img/explosion.gif',
					iconSize: [50, 60], 
					iconAnchor: [25, 30], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
                    
	/*объект маркера юнита, с помощью которого он отображается на карте */
	this.marker = 
	{
		area: L.circle([latlng.lat,latlng.lng], 1, {color: '#ff0', fillColor: '#f03', opacity: 0.1,fillOpacity:0.1 }).addTo(map),
        battle: L.marker([latlng.lat,latlng.lng],{icon:this.iconUnselected}).addTo(map),
        type: L.marker([latlng.lat,latlng.lng],{icon:this.type.icon}).addTo(map),
		country: L.marker([latlng.lat,latlng.lng],{icon:this.country.icon}).addTo(map),
		explosion: L.marker([latlng.lat,latlng.lng],{icon:this.iconUnselected}).addTo(map),
        selected: L.marker([latlng.lat,latlng.lng],{icon:this.iconUnselected}).addTo(map)
	};
	
	/**
    * перемещение юнита в указанную точку
    * @param latlng координаты точки [lat, lng]
    **/
    this.replace = function(latlng){
	   Move.replaceMarker( latlng, this );
	};
    
    
    /**
    * возвращает величину DELTA - смещение юнита за один такт (от этого зависит скрость)
    **/
    this.getDelta = function(){
        /*зависимость скорости от рельефа*/
        var k = 0.1;
        if ( this.elevation == 0 || this.lastelevation == 0 ){
            var elevationCoff = 1;
        }else{
            var elevationCoff = ( 1 + k * ( (this.lastelevation - this.elevation) / this.elevation )) ;
        }
        
        /*понижение скорости в атаке*/
        var delta = ( this.status.kind == 'attack' )? this.status.speed_coff * this.type.DELTA : this.type.DELTA;
        return delta * elevationCoff;
    };
    
    /**
    * перемещение юнита в точку события по прямой с анимацией
    * @param e объект события
    **/
	this.goTo = function(e){
		Move.moveMarkerLineAnimation( e, this, function(){} );
	};
	
    /**
    * перемещение юнита в точку события по маршруту с анимацией
    * @param latlng объект {lat:lat,lng:lng}
    **/
	this.goRoute = function(latlng){
		var object = this;
        var source = {lat: this.marker.type.getLatLng().lat, lng: this.marker.type.getLatLng().lng};
        Route.getRoute(latlng,source,function(route){    
            Move.moveMarkerRouteAnimation( object, route );
		});	
	};
	
    /**
    * выделение юнита
    **/
	this.select = function(){
		this.selected = true;
		this.marker.selected.setIcon(this.iconSelected);
	};
	
    /**
    * отмена выделения юнита
    **/
	this.unselect = function(){
		this.selected = false;
		this.marker.selected.setIcon(this.iconUnselected);
		map.off('dblclick',null,this);
	};
	
     /**
    * установка анимации для обозначения состояния боя
    * @param battle устанавливаемый флаг боя
    **/
    this.checkBattle = function(){
        if ( this.lastbattle == this.battle ) return;
        if ( this.battle ){
            this.lastbattle = this.battle;
            this.marker.battle.setIcon(this.iconBattle);
        }else{
            this.lastbattle = this.battle;
            this.marker.battle.setIcon(this.iconUnselected);
        } 
    };
    
    /**
    * Установка статуса юнита
    * @param status вид статуса
    **/
    this.setStatus = function(status){
        if ( this.status.kind == status ) return false;
        if ( status != 'march' && status != 'defense' ){
            return false;
        }
        this.status.kind = status; 
    };
    
    /**
    * Установка страны принадлежности юнита
    **/
    this.changeOwner = function(){
       createGameMessage(getGameMsg('baseCaptured', this));
       var countryId = ( this.country.id == Missions.country1.id )? Missions.country2.id : Missions.country1.id;
       for ( key in Countries ){
            if ( key == countryId ) this.country =  Countries[key][0];   
        }
       this.OWN  = (this.OWN)? false : true;
       this.init();   
    };
    
    /**
    * инициализация объекта юнита
    **/
	this.init = function(){
		this.marker.type.setIcon(this.type.icon);
		this.marker.country.setIcon(this.country.icon);
        iconSelectedUrl = ( this.OWN )? '/img/selected.png' : '/img/enemy.selected.png';
        this.iconSelected = L.icon({ iconUrl: iconSelectedUrl,
					iconSize: [50, 50], 
					iconAnchor: [25, 25], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
	   this.marker.area.setRadius(this.type.radius * 111300);
    };
    
	
	/**
    * выдача данных о ресурсах юнита
    * @return объект с информацией
    **/
    this.getInfo = function(){
		var info = {
    		          id: this.id, 
                      country: this.country.name, 
                      type: this.type.name,
                      people: this.type.resources.men,
                      ammo: this.type.resources.ammo,
                      food:  this.type.resources.food,
                      elevation:  this.elevation,
                      around: this.around,
                      battle: this.battle,
                      status: this.status.kind,
                      weather: JSON.stringify(this.weather)
                  };
		return info;
	};
    
    
    /**
    * здесь может быть реализовано обновление состояния юнита
    **/
	this.update = function(){
	    this.checkBattle();
        if ( this.type.resources.food <= 0 || this.type.resources.men <= 0 ){
            this.marker.explosion.setIcon(this.iconExplosion);
            var self = this;
            setTimeout( function(){game.deleteBase(self.id);}, 3000);
		}
	};
	
    /**
    * уничтожение объекта юнита
    **/
	this.destroy = function(){
		map.removeLayer(this.path);
		delete this.type;
		this.marker.selected.clearAllEventListeners();
		if ( this.selected ) Handler.removeDblclick(this);
		for ( marker in this.marker ) map.removeLayer(this.marker[marker]);
	};
    
    /*преобразование в строку*/
    this.toString = function(){
        var base = {};
        base.country = this.country.toString();
        base.type = this.type.toString();
        base.id = this.id;
        base.userId = this.userId;
        base.MOVE = this.MOVE;
        base.OWN = this.OWN;
        base.latlng = [this.marker.selected.getLatLng().lat, this.marker.selected.getLatLng().lng];
        base.selected = this.selected;
        base.colorPath = this.colorPath;
        base.around = this.around;
        base.elevation = this.elevation;
        base.lastelevation = this.lastelevation;
        base.battle = this.battle;
        base.status = this.status;
        base.weather = this.weather;
        base.enemyCount = this.enemyCount; 
        return base;  
    };
	
	/*Обработчики событий*/
	
    this.marker.selected.on('click', function(){Handler.click(this)},this);
	this.marker.selected.on('contextmenu',function(){Handler.contextmenu(this)},this);
	this.marker.selected.on('mouseover', function(){Handler.mouseover(this)},this);
    this.marker.selected.on('mouseout', function(){Handler.mouseout(this)},this);
    
}//end func
