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
exports.getRandomInt = getRandomInt;