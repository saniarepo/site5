/**
* объект, содержащий обработчики событий
* для юнитов
**/

var Handler = 
{
    /**
    * обработчик события  click на юните
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    * @param game клиентский объект игры Game 
    **/
    click: function(object){
        
		if ( object.selected ){
			object.unselect();
		}
		else{
			if ( !object.OWN ) game.unselectNotOwn();
			object.select();
			if ( object.OWN ){
			     map.once('dblclick', function(e){
    				Handler.dblclick(e,object);
    			},object);
			}
            else{
                object.marker.selected.once('dblclick',function(){
                    Handler.attack(object.id);
                },object);
            }       
		}
    },
    
    /**
    * обработчик события  doubleclick на юните
    * @param object объект юнита Regiment или Base
    * @param e объект события
    **/
    dblclick: function(e, object){
        var latlng = {lat: e.latlng.lat, lng: e.latlng.lng};
        object.goRoute(latlng);
        object.unselect();
    			
    },
    
    /**
    * обработчик события клика правой кнопкой мыши на юните
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    **/
    contextmenu: function(object){
   	    object.popup.setLatLng(object.marker.selected.getLatLng()).setContent(iface.showMenu(object)).openOn(map);   
    },
    
    /**
    * удаление обработчика события  doubleclick с юнита
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    **/
    removeDblclick: function(object){
        map.off('dblclick',null,object);
    },
    
    mouseover: function(object){
         for ( marker in object.marker ) {
            if ( marker != 'area' )object.marker[marker].setOpacity(0.7);
         }
         iface.showUnit(object.getInfo());
         this.overUnit = object;      
    },
    
    mouseout: function(object){
         for ( marker in object.marker ) {
            if ( marker != 'area') object.marker[marker].setOpacity(1.0);
         }
         iface.hideUnit();
         this.overUnit = null;
    },
    
    overUnit: null,
    
    /**
    * обработчики контектсного меню
    * @param id индекс функции обработчика
    * @param objectId id объекта юнита
    **/
    unitcontextmenu: function(id, objectId){
        var contextMenuHandler = [
                            this.ownRegStop, /*отмена марша своего полка*/
                            this.ownRegMarch,       /*включение состояния полка марш*/
                            this.ownRegDefense,  /*включение состояния полка оборона*/
                            this.ownRegAttack,   /*включение состояния атаки*/
                            this.attack,         /*команда на атаку вражеского полка*/
                            this.ownBaseStop, /*отмена марша своей базы*/
                            this.ownBaseMarch,      /*включение состояния базы марш*/
                            this.ownBaseDefense, /*включение состояния базы оборона*/
                            this.baseCapture     /*команда на захват вражеской базы*/
                        ];
        contextMenuHandler[id](objectId);
    },
    
    /*отмена марша своего полка*/
    ownRegStop: function(id){  
        var object = game.getRegiment(id);
        if ( object == null || object.MOVE == false ) return false;
        object.STOP = true;
    },
    
    /*включение состояния полка марш*/
    ownRegMarch: function(id){
        var object = game.getRegiment(id);
        if ( object == null ) return false;
        object.setStatus('march');
    },
    
    /*включение состояния полка оборона*/
    ownRegDefense: function(id){
        var object = game.getRegiment(id);
        if ( object == null ) return false;
        if (object.MOVE) object.STOP = true;
        object.setStatus('defense')
    },
    
    /*включение состояния атаки*/
    ownRegAttack: function(id){
        var object = game.getRegiment(id);
        if ( object == null ) return false;
        object.setStatus('attack')
    },
    
    /*команда на атаку вражеского полка*/
    attack: function(id){
        var object = game.getRegiment(id);
        if ( object == null ) return false;
        var latlng  = { lat: object.toString().latlng[0], lng: object.toString().latlng[1] };
        for ( var i = 0; i < game.regiments.length; i++ ){
            if ( game.regiments[i].OWN && game.regiments[i].selected ){
                game.regiments[i].setStatus('attack');
                game.regiments[i].goRoute(latlng);
            }
        }
    },
    
    /*отмена марша своей базы*/
    ownBaseStop: function(id){
        var object = game.getBase(id);
        if ( object == null || object.MOVE == false ) return false;
        object.STOP = true;
    },
    
    /*включение состояния базы марш*/
    ownBaseMarch: function(id){
        var object = game.getBase(id);
        if ( object == null ) return false;
        object.setStatus('march');
    },
    
    /*включение состояния базы оборона*/
    ownBaseDefense: function(id){
        var object = game.getBase(id);
        if ( object == null ) return false;
        if (object.MOVE) object.STOP = true;
        object.setStatus('defense');
    },
    
    /*команда на захват вражеской базы*/
    baseCapture: function(id){
        var object = game.getBase(id);
        if ( object == null ) return false;
        var latlng  = { lat: object.toString().latlng[0], lng: object.toString().latlng[1] };
        for ( var i = 0; i < game.regiments.length; i++ ){
            if ( game.regiments[i].OWN && game.regiments[i].selected ){
                game.regiments[i].setStatus('attack');
                game.regiments[i].goRoute(latlng);
            }
        }
    }
                   
}