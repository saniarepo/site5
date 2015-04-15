/*библиотека функций управления интерфейсом*/

/**
* функция для скрытия/развертывания блока
* @param el элемент по которому кликаем 
* @param textHide текст элемента для сворачивания
* @param textShow текст элемента для разворачивания
* @param classHide класс присваиваемый для сокрытия
* @param classShow класс присваиваемый для разворачивания
**/
function hideShowElement(el, textHide, textShow, classHide, classShow){
    var parent = el.parentNode;
    el.onclick = function(){
        if ( el.innerText == textHide || el.textContent == textHide ){
        el.innerText = textShow;
        el.textContent = textShow;
        parent.className = classHide;
        }else{
            el.innerText = textHide;
            el.textContent = textHide;
            parent.className = classShow;
        }
    }
}

/**
* показ элемента
* @param el объект элемента
**/
function showElem(el){
	el.style.display = 'inline-block';
}
/**
* скрытие элемента
* @param el объект элемента
**/
function hideElem(el){
	el.style.display = 'none';
}

/**
* обработка кнопки начать при создании игры первым игроком
* @param iface объект интерфейса
**/
function begin_init(iface){
        name = iface.input_name.value;
        if ( name.length < 2 ){
            iface.error_div.innerText = 'Введите имя';
            iface.error_div.textContent = 'Введите имя';
            return false;
        }
        iface.wrap_start_div.style.display='none';
        iface.map_div.style.opacity = 1;
        showControlBlocks();
        
        user.name = name;
        Helper.deleteCookie('user');
        Helper.setCookie('user', name, { expires: 31000000 });
       
        country = iface.country_select.value;
        mission = iface.mission_select.value;
        game = new Game( user );
        game.selectCountry(Countries[country][0]);
        game.selectMission(Missions[mission].object);
        gameInit();
        
        //Debug.trace(JSON.stringify(game.toString()));
}

/**
* обработка кнопки начать при присоединении к игре второго игрока
* @param iface объект интерфейса
**/
function begin_join(iface){
        name = iface.input_name.value;
        if ( name.length < 2 ){
            iface.error_div.innerText = 'Введите имя';
            iface.error_div.textContent = 'Введите имя';
            return false;
        }
        iface.wrap_start_div.style.display='none';
        iface.map_div.style.opacity = 1;
        showControlBlocks();
        
        user.name = name;
        Helper.deleteCookie('user');
        Helper.setCookie('user', name, { expires: 31000000 });
       
        country = iface.country_select.value;
        mission = iface.mission_select.value; 
        game = new Game( user );
        game.selectCountry(Countries[country][0]);
        game.selectMission(Missions.object);
        gameClone();
        //Debug.trace('game.toString'+JSON.stringify(game.toString()));
}


/*обновление списка стран при изменении миссии*/
function updateCountry(){
    iface.parent_country_select.removeChild(iface.country_select);
    iface.country_select = document.createElement('select');
    iface.parent_country_select.appendChild(iface.country_select);
    iface.setMissionDecs(Missions[iface.mission_select.value].object.desc.all);
        
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
}

/**
* обработчик кнопки выхода из игры
**/
function btnExitHandler(){
    gameExit();
}

/**
* обработчик кнопки паузы
**/
function btnPauseHandler(iface){
     if ( iface.button_pause.innerText == 'Пауза' || iface.button_pause.textContent == 'Пауза'){
        if ( game.start ){
            iface.button_pause.innerText = 'Старт';
            iface.button_pause.textContent = 'Старт';
            gamePause();
        }
        
    }else{
        iface.button_pause.innerText = 'Пауза';
        iface.button_pause.textContent = 'Пауза';
        gameStart();
    }  
}


/**
* удаление дочерних узлов у DOM элемента
* @param node DOM элемент
**/
function destroyChildren(node)
{
  node.innerHTML = '';
  while (node.firstChild)
      node.removeChild(node.firstChild);
}

/**
* объект для перевода представления данных об юните
**/

var translate = 
{
    id: 'Идентификатор',
    country: 'Страна',
    type: 'Тип',
    people: 'Личный состав',
    ammo: 'Боеприпасы',
    food: 'Обеспечение',
    discipline: 'Организованность',
    experience: 'Опыт',
    elevation: 'Высота',
    around: 'Окружение',
    battle: 'Бой',
    status: 'Состояние',
    attack: 'Атака',
    defense: 'Оборона',
    march: 'Марш',
    weather: 'Погода'  
};

/**
* обновление информации об юните во всплывающем блоке
**/
function updateInfoUnit(){
    if ( iface.unitinfo_div.style.display == 'block' && Handler.overUnit != null){
        iface.showUnit(Handler.overUnit.getInfo());
    }  
};

/**
* возвращает html код меню для полка
* @param object объект юнита
**/
function getRegimentMenu(object){ 
    var menu = '';
    if (object.OWN ){
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Handler.unitcontextmenu(0,"+object.id+")'>Стоп</li>\
                        <li onclick='Handler.unitcontextmenu(1,"+object.id+")'>Марш</li>\
                        <li onclick='Handler.unitcontextmenu(2,"+object.id+")'>Оборона</li>\
                        <li onclick='Handler.unitcontextmenu(3,"+object.id+")'>Атака</li>\
                    </ul>";
    }else{
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Handler.unitcontextmenu(4,"+object.id+")'>Атаковать</li>\
                    </ul>";
    }
    return menu;
}

/**
* возвращает html код меню для базы
* @param object объект юнита
**/
function getBaseMenu(object){ 
    var menu = '';
    if (object.OWN ){
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Handler.unitcontextmenu(5,"+object.id+")'>Стоп</li>\
                        <li onclick='Handler.unitcontextmenu(6,"+object.id+")'>Марш</li>\
                        <li onclick='Handler.unitcontextmenu(7,"+object.id+")'>Оборона</li>\
                    </ul>";
    }else{
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Handler.unitcontextmenu(8,"+object.id+")'>Уничтожить</li>\
                    </ul>";
    }
    return menu;
}


/**
* возвращает строку сообщения об окончании игры
* @param объект user
* @param won объект user победителя в игре, присланный с сервера
**/
function getGameOverMess(user, won){
    if ( user.id == won.id ){
        return 'Вы выиграли!';
    }else{
        return 'Вы проиграли!';
    }
}

/**
* показ блоков с кнопками и сообщениями
**/
function showControlBlocks(){
    var blocks = document.getElementsByClassName('control-block');
        for ( var i = 0; i < blocks.length; i++ ){
            blocks[i].style.display = 'block';
        }
}

