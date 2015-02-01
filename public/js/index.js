/*начальная инициализация клиентского приложения*/
window.onload = function(){
    
    Helper.addScript('/js/map.js');
    
    /*установка сервиса маршрутов*/
    var selectService = document.getElementById('service');
    Route.service = selectService.value;
    
    /*смена сервиса маршрутов*/
    selectService.onchange = function(){
		Route.service = selectService.value;
	};
   	
};	