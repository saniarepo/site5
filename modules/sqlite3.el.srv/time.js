/*модуль для измерения интервала времени*/
var begin = null;
var end = null;

/**
* включение начала отсчета
**/
function start(){
	begin = new Date();
}

/**
* выключение отсчета и возврат измеренного интервала времени 
* @return delta интервал времени в миллисекундах
**/
function stop(){
	end = new Date();
	delta = end.getTime() - begin.getTime();
	return delta;
}

exports.start = start;
exports.stop = stop;