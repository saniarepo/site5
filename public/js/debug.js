/**
* модуль для облегчения отладки
**/
var Debug = 
{
	/*вывод массива точек пути*/
    showPaths: function(){
		for ( var i  = 0; i < Game.regiments.length; i++ ){
			console.log(i+': '+JSON.stringify(Game.regiments[i].path.getLatLngs()));
		}
	},
	
    /*вывод заданного сообщения */
	trace: function(x){
		console.log(x);
	},
    
    /*вывод типа юнита*/
	showRegimentsType: function(){
		for ( var i  = 0; i < Game.regiments.length; i++ ){
			console.log(i+': '+JSON.stringify(Game.regiments[i].type));
		}
	}

}