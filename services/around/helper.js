function getTime(){
    var d = new Date();
    var time= d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    return time;
}


function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.getTime = getTime;
exports.getRandomInt = getRandomInt;