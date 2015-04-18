function getTime(){
    var d = new Date();
    var time= d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    return time;
}


function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* ѕолучение строки даты
* на year год
* @return time строка в формате yyyymmdd
*
**/
function getDate(year){
    var d = new Date();
    var date= '';
    var month = '' + (d.getMonth()+1);
    if (month.length < 2) month = '0' + month;
    var day = '' + d.getDate();
    if (day.length < 2) day = '0' + day;
    date += year;
    date += month;
    date += day;
    return date;
}


exports.getTime = getTime;
exports.getRandomInt = getRandomInt;
exports.getDate = getDate;