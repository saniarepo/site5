var parameters = 
{
    services:
    {
        around: '../services/around/around',         /*сервис детекции окружения*/
        elevation: '../services/elevation/elevation',/*сервис высот*/
        weather: '../services/weather/weather'       /*сервис погодных данных*/
    },
    missions_module: '../missions/missions5',      /*файл c модулем миссий*/
    USER_MAX: 2                    /*максимальное количество пользователей*/
    
};


exports.parameters = parameters;
