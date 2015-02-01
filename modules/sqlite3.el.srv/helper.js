/*вспомогательный модуль*/
/**
* получение текущих даты и времени в виде строки
* @return time срока с датой и временем
**/
function getTime(){
    var d = new Date();
    var time= d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    return time;
}

/**
* получение случайного целого числа от min до max
* @param min, max границы интервала случайного числа
* @return случайное число от min до max
**/
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.getTime = getTime;
exports.getRandomInt = getRandomInt;