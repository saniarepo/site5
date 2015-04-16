/**
* управление стартовым интерфейсом игры
**/

/**
* объект содержащий элементы интерфейса
**/
var iface = 
{
    wrap_start_div: document.getElementById('wrap-start'),
    map_div: document.getElementById('map'),
    mission_select: null,
    country_select: null,
    parent_mission_select: document.getElementById('td-mission'),
    parent_country_select: document.getElementById('td-country'),
    button_start: document.getElementById('btn-start'),
    input_name: document.getElementById('input-name'),
    error_div: document.getElementById('error-block'),
    button_exit: document.getElementById('btn-exit'),
    button_pause: document.getElementById('btn-pause'),
    log_div: document.getElementById('log-message'),
    info_div: document.getElementById('info-message'),
    unitinfo_div: document.getElementById('unit-info'),
    weatherinfo_div: document.getElementById('weather-info'),
    gameover_div: document.getElementById('game-over'),
    label_next: document.getElementById('label-next'),
    preloader: document.getElementById('preloader'),
    label_mission: document.getElementById('mission-label'),
    missioninfo_div: document.getElementById('mission-info'),
    missiondesc_p: document.getElementById('mission-desc'),
    /*перезагрузка страницы*/
    reloadPage: function(url){ window.location.replace(url); },
    
    /**
    * запись сообщения в поле лога
    * @param mess массив строк сообщения
    **/
    addLog: function(mess){
        destroyChildren(this.log_div);
        for ( var i = 0; i < mess.length; i++ ){
            var p = document.createElement('p');
            p.innerText = mess[i];
            p.textContent = mess[i];
            this.log_div.appendChild(p);
        }
    },
    
    /**
    * запись сообщения в поле сводки
    * @param mess массив строк сообщения
    **/
    addInfo: function(mess){
        destroyChildren(this.info_div);
        for ( var i = 0; i < mess.length; i++ ){
            var p = document.createElement('p');
            p.innerText = mess[i];
            p.textContent = mess[i];
            this.info_div.appendChild(p);
        }
    },
    
    /**
    * показ информации о юните
    * @param unit объект содержащий данные об юните
    **/
    showUnit: function(unit){
        var ul = document.createElement('ul');
        for ( var item in unit ){
            if ( item == 'weather' ) continue;
            var li = document.createElement('li');
            var value = unit[item];
            if ( typeof(value) == 'boolean' && value == false ) value = 'Нет';
            if ( typeof(value) == 'boolean' && value == true ) value = 'Да';
            if ( typeof(value) == 'string' && translate[value] != undefined ) value = translate[value];
            var text = translate[item] + ': ' + value;
            li.innerText = text;
            li.textContent = text;
            ul.appendChild(li);
        }
        destroyChildren(this.unitinfo_div);
        destroyChildren(this.weatherinfo_div);
        this.weatherinfo_div.style.display = 'block';
        this.weatherinfo_div.innerHTML = formatWeatherData(unit.weather);
        this.unitinfo_div.style.display = 'block';
        this.unitinfo_div.appendChild(ul);
    },
    
    /**
    * скрытие информации о юните
    **/
    hideUnit: function(){
        
        destroyChildren(this.unitinfo_div);
        this.unitinfo_div.style.display = 'none';
        destroyChildren(this.weatherinfo_div);
        this.weatherinfo_div.style.display = 'none';
    },
    
    /**
    * показ описания миссии
    **/
    showMission: function(){
        var p = document.createElement('p');
        var text = game.mission.desc[game.country.id];
        p.innerText = text;
        p.textContent = text;
        this.missioninfo_div.style.display = 'block';
        this.missioninfo_div.appendChild(p);
    },
    
    /**
    * скрытие описания миссии
    **/
    hideMission: function(){
        destroyChildren(this.missioninfo_div);
        this.unitinfo_div.style.display = 'none';
    },
    
    setMissionDecs: function(text){
        this.missiondesc_p.innerText = text;
        this.missiondesc_p.textContent = text; 
    },
    
    /**
    * показ контекстного меню юнита
    * @param unit объект юнита
    **/
    showMenu: function(unit){
        if ( unit instanceof RegimentBase ) return getRegimentMenu(unit);
        if ( unit instanceof SupplyBase ) return getBaseMenu(unit);
    },
    
    /**
    * показ сообщения об окончании игры 
    **/
    showGameOver: function(mess){
        var p = this.gameover_div.firstChild;
        p.innerText = mess;
        p.textContent = mess;
        this.gameover_div.style.display = 'block';
        window.onkeypress = function(e){  if(e.keyCode == 13) gameExit();};
    }  
};

if ( !isGameInit )/*если игра еще не создана*/
{
        /*выводим на передний план стартовое меню*/
        iface.wrap_start_div.style.display='block';
        iface.map_div.style.opacity = 0;
        
        /*создаем select и заполняем его миссиями*/
        iface.mission_select = document.createElement('select');
        iface.parent_mission_select.appendChild(iface.mission_select);
        for ( key in Missions ){
            var opt = document.createElement('option');
            opt.setAttribute('value',key);
            opt.innerText = Missions[key].name;
            opt.textContent = Missions[key].name;
            iface.mission_select.appendChild(opt);
        }
        
        iface.setMissionDecs(Missions[iface.mission_select.value].object.desc.all);
        /*создаем select и заполняем его соответсвующими странами*/
        iface.country_select = document.createElement('select');
        iface.parent_country_select.appendChild(iface.country_select);
        
        if ( Missions[iface.mission_select.value]['country1']['selected'] == false ){
            var opt = document.createElement('option');
            opt.setAttribute('value',Missions[iface.mission_select.value]['country1']['id']);
            opt.innerText = Missions[iface.mission_select.value]['country1']['name'];
            opt.textContent = Missions[iface.mission_select.value]['country1']['name'];
            iface.country_select.appendChild(opt);  
        }
        
        if ( Missions[iface.mission_select.value]['country2']['selected'] == false ){
            var opt = document.createElement('option');
            opt.setAttribute('value',Missions[iface.mission_select.value]['country2']['id']);
            opt.innerText = Missions[iface.mission_select.value]['country2']['name'];
            opt.textContent = Missions[iface.mission_select.value]['country2']['name'];
            iface.country_select.appendChild(opt);  
        }
        
        /*при изменении миссии приводим в соответсвие список стран*/
        iface.mission_select.onchange = updateCountry;
        
        /*обработка кнопки начать*/       
        iface.button_start.onclick = function(){ begin_init(iface);};
        window.onkeypress = function(e){ if(e.keyCode == 13) begin_init(iface);};
}
else
{       /*если игра уже создана*/
    
    //console.log(JSON.stringify(remoteGame.users) +':'+JSON.stringify(user));
    if ( Helper.isUserNew() || !Helper.isUserIdPresent(remoteGame, user.id) ){/*если пользователь новый*/
         /*выводим на передний план стартовое меню*/
        iface.wrap_start_div.style.display='block';
        iface.map_div.style.opacity = 0;
        
        /*создаем select и заполняем его уже выбранной миссией*/
        iface.mission_select = document.createElement('select');
        iface.parent_mission_select.appendChild(iface.mission_select);
        
        var opt = document.createElement('option');
        opt.setAttribute('value',Missions.object.id);
        opt.innerText = Missions.name;
        opt.textContent = Missions.name;
        iface.mission_select.appendChild(opt);
        
        /*создаем select и заполняем его оставшейся страной*/
        iface.country_select = document.createElement('select');
        iface.parent_country_select.appendChild(iface.country_select);
        
        var opt = document.createElement('option');
        opt.setAttribute('value',Missions.country.id);
        opt.innerText = Missions.country.name;
        opt.textContent = Missions.country.name;
        iface.country_select.appendChild(opt);  
        
        iface.setMissionDecs(Missions.object.desc.all);
        
        /*обработка кнопки начать*/       
        iface.button_start.onclick = function(){ begin_join(iface);};
        window.onkeypress = function(e){  if(e.keyCode == 13) begin_join(iface);};
    
    }else{
        
        /*если пользователь старый (обработка перезагрузки страницы), 
        * то восстанавливаем его состояние игры */
        iface.wrap_start_div.style.display='none';
        iface.map_div.style.opacity = 1;
        showControlBlocks();
        user.name = Helper.getCookie('user');
        game = new Game( user );
        restoreGame();
    }

}

/*обработка кнопки выхода*/
iface.button_exit.onclick = btnExitHandler;


/*обработка кнопки паузы*/
iface.button_pause.onclick = function(){ btnPauseHandler(iface); };

/*обработчик клика на метке "Дальше"*/
iface.label_next.onclick = function(){ gameExit(); };

/*показ описания миссии*/
iface.label_mission.onmouseover = function(){ iface.showMission(); };

/*скрытие описания миссии*/
iface.label_mission.onmouseout = function(){ iface.hideMission(); }; 

/*включение скрытия/показа блоков*/
hideShowElement( document.getElementById('label-btn-block'), 'Скрыть кнопки', 'Показать кнопки', 'btn-block control-block grad2 font-response hide', 'btn-block control-block grad2 font-response' );
hideShowElement( document.getElementById('label-log-block'), 'Скрыть лог', 'Показать лог', 'log-block control-block grad2 font-response hide', 'log-block control-block grad2 font-response' );
hideShowElement( document.getElementById('label-info-block'), 'Скрыть сводку', 'Показать сводку', 'info-block control-block grad2 font-response hide', 'info-block control-block grad2 font-response' );

