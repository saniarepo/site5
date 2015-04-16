/*вспомогательный модуль*/
/**
* Получение текущего времени
* @return time строка в формате yyyy-mm-dd h:m:s
*
**/
function getTime(){
    var d = new Date();
    var time= d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    return time;
}

/**
* Получение строки даты сдвинутой относительно текущей
* на delta лет назад
* @return time строка в формате yyyymmdd
*
**/
function getDate(delta){
    var d = new Date();
    var date= '';
    var year = d.getFullYear()-delta;
    var month = '' + (d.getMonth()+1);
    if (month.length < 2) month = '0' + month;
    var day = '' + d.getDate();
    if (day.length < 2) day = '0' + day;
    
    date += year;
    date += month;
    date += day;
    return date;
}


/**
* Получение случайного целого числа
* @param min нижняя граница
* @param max верхняя граница
* @return целое число в интервале от min до max
*
**/
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.getTime = getTime;
exports.getDate = getDate;
exports.getRandomInt = getRandomInt;