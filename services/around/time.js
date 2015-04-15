var begin = null;
var end = null;


function start(){
	begin = new Date();
}

function stop(){
	end = new Date();
	delta = end.getTime() - begin.getTime();
	return delta;
}

exports.start = start;
exports.stop = stop;