window.onload = function(){
    var btnCreateFile = document.getElementById('create');
    var btnSave = document.getElementById('save');
    var btnClear = document.getElementById('clear');
    var btnClearAll = document.getElementById('clear-all');
    
    var labels = document.getElementsByClassName('help');
    for ( var i = 0; i < labels.length; i++ ){
        labels[i].onmouseover = showHelp;
        labels[i].onmouseout = hideHelp;
    }
    
    fillCountries();
    fillTypes();
    btnCreateFile.onclick = create;
    btnSave.onclick = save;
    btnClearAll.onclick = clearAll;
    btnClear.onclick = clear;
    map.on('click',makeUnit);
    
}

/*юниты в миссии*/
var units = {regiment1:[], regiment2:[], base1:[], base2:[]};

/*массив миссий*/
var missions = [];


/*получаем выбранный вариант юнита*/
function getRadio(){
    var inputs = document.getElementsByTagName('input');
    for ( var i = 0; i < inputs.length; i++ ){
        if ( inputs[i].attributes.name.value == 'unit' )
            if ( inputs[i].attributes.type.value == 'radio' )
                if( inputs[i].checked ) return inputs[i].value;
    }
    return null;
}

/*создаем файл миссий*/
function create(){
    if ( missions.length == 0 ){
        alert('Нет сохраненных миссий');
        return;
    }
    var mission_file = document.getElementById('mission_file').value;
    var params = 'data=' + JSON.stringify(missions);
    params +='&file=' + mission_file;
    var countries = {};
    for ( key in Countries ){
        countries[key] = Countries[key][1];
    }
    params +='&countries=' + JSON.stringify(countries);
    console.log(params);
    Ajax.sendRequest('POST', '/makemissions', params, done ); 
}

/*очищаем данные по редактируемой миссии*/
function clear(){
    for ( var key in units ){
        for ( var i = 0; i < units[key].length; i++ ){
            map.removeLayer(units[key][i].marker[0]);
            map.removeLayer(units[key][i].marker[1]);
        }
        units[key] = [];
    }
}

/*очищаем данные по всем сохраненным  и редактируемой миссиям*/
function clearAll(){
    clear();
    missions = [];
}

/*сохраняем одну миссию*/
function save(){
    for ( var key in units ){
        if ( units[key].length == 0 ) {
            alert('Не установлены все нужные юниты на карте');
            return;
        }
    }
    var id = document.getElementById('mission_id').value;
    var country1 = document.getElementById('country1').value;
    var country2 = document.getElementById('country2').value;
    var desc = {};
    desc[country1] = document.getElementById('desc1').value;
    desc[country2] = document.getElementById('desc2').value;
    desc['all'] = document.getElementById('desc').value;
    var db_file = document.getElementById('db_file').value;
    var year = document.getElementById('mission_year').value;
    var name = document.getElementById('mission_name').value;
    var center = calcCenter(units);
    var mission = {
        id: id,
        name: name,
        regiments: getRegimentsArray(units),
        bases: getBasesArray(units),
        desc: desc,
        center: center,
        year: year,
        db_file: db_file
    };
    missions.push(mission);
    alert('Миссия сохранена; Всего миссий: ' + missions.length);
    clear();
}

/*ставим юнита на карту*/
function makeUnit(e){
    var radio = getRadio();
    var type =  (radio == 'base1' || radio == 'base2')? 'none' : document.getElementById('unit-type').value;
    var country = ( radio == 'regiment1' || radio == 'base1' )? document.getElementById('country1').value : document.getElementById('country2').value;
    var iconCountry = Countries[country][0].icon;
    var typeObject = getType(type);
    var iconType = typeObject.icon;
    var markerCountry = L.marker(e.latlng,{draggable:false, icon: iconCountry}).addTo(map);
    var markerType = L.marker(e.latlng,{draggable:false, icon: iconType}).addTo(map);
    var marker = [markerCountry, markerType];
    var latlng = [e.latlng.lat, e.latlng.lng];
    var unit = {latlng:latlng, country: country, type: type, marker: marker };
    units[radio].push(unit);
}

/*заполняем список стран*/
function fillCountries(){
    var selectCountry1 = document.getElementById('country1');
    var selectCountry2 = document.getElementById('country2');
    for ( var key in Countries ){
        var opt1 = document.createElement('option');
        var opt2 = document.createElement('option');
        opt1.value = key;
        opt1.innerText = Countries[key][1];
        opt1.textContent = Countries[key][1];
        selectCountry1.appendChild(opt1);
        opt2.value = key;
        opt2.innerText = Countries[key][1];
        opt2.textContent = Countries[key][1];
        selectCountry2.appendChild(opt2);
    }
}

/*заполняем список типов полков*/
function fillTypes(){
    var selectType = document.getElementById('unit-type');
    for ( var key in Types ){
        var opt = document.createElement('option');
        opt.value = key;
        opt.innerText = Types[key][1];
        opt.textContent = Types[key][1];
        selectType.appendChild(opt);
    }
}

/*показываем блок с подсказкой*/
function showHelp(){
    document.getElementById('help').style.display = 'block';
}

/*прячем блок с подсказкой*/
function hideHelp(){
    document.getElementById('help').style.display = 'none';
}

/*вычисление центра карты*/
function calcCenter(units){
    var centerLng = 0;
    var centerLat = 0;
    var numberUnit = 0;
    for ( var key in units ){
        for ( var i = 0; i < units[key].length; i++ ){
            centerLat += units[key][i].latlng[0];
            centerLng += units[key][i].latlng[1];
        }
        numberUnit += units[key].length;
    }
    centerLat = centerLat / numberUnit;
    centerLng = centerLng / numberUnit;
    return [centerLat, centerLng];
}

/*составление массива полков*/
function getRegimentsArray(units){
    var regiments  = [];
    for ( var i = 0; i < units.regiment1.length; i++ ){
        regiments.push({latlng:units.regiment1[i].latlng, country:units.regiment1[i].country, type:units.regiment1[i].type});
    }
    for ( var i = 0; i < units.regiment2.length; i++ ){
        regiments.push({latlng:units.regiment2[i].latlng, country:units.regiment2[i].country, type:units.regiment2[i].type});
    }
    return regiments;
}

/*составление массива баз*/
function getBasesArray(units){
    var bases  = [];
    for ( var i = 0; i < units.base1.length; i++ ){
        bases.push({latlng:units.base1[i].latlng, country:units.base1[i].country, type:units.base1[i].type});
    }
    for ( var i = 0; i < units.base2.length; i++ ){
        bases.push({latlng:units.base2[i].latlng, country:units.base2[i].country, type:units.base2[i].type});
    }
    return bases;
}

/*сообщам об успешном создании файла и все чистим*/
function done(result){
    alert('Файл миссий ' + result.file + ' успешно создан');
    clearAll();
}