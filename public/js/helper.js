/**
* модуль содержащий набор вспомогательных функций
**/
var Helper = 
{
    /**
    * динамическое добавление подключения скрипта на страницу
    * @param src url до скрипта
    **/
    addScript: function(src){
        var scriptElem = document.createElement('script');
        scriptElem.setAttribute('src',src);
        scriptElem.setAttribute('type','text/javascript');
        document.getElementsByTagName('head')[0].appendChild(scriptElem);
    },
    
    /**
    * генерация случайного целого числа
    * @param min, max верхняя и нижняя границы диапазона
    * @return случайное целое число от min до max
    **/
    getRandomInt: function(min, max)
	{
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    /**
    * получение cookie с именем name
    * @param name имя
    * @return  cookie с именем name, если есть, если нет, то undefined
    **/
    getCookie:  function(name) {
          var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
          return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    
     /**
    * установка значения cookie с именем name
    * @param name имя
    * @param value значение
    * @param options объект с опциями 
    **/
    setCookie: function(name, value, options) {
        options = options || {};
        
        var expires = options.expires;
        
        if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires*1000);
        expires = options.expires = d;
        }
        if (expires && expires.toUTCString) { 
        options.expires = expires.toUTCString();
        }
        
        value = encodeURIComponent(value);
        
        var updatedCookie = name + "=" + value;
        
        for(var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];    
            if (propValue !== true) { 
              updatedCookie += "=" + propValue;
             }
        }
        document.cookie = updatedCookie;
    },
    
    /**
    * удаление cookie с именем name
    * @param name имя
    **/
    deleteCookie: function(name) {
        this.setCookie(name, "", { expires: -1 })
    },
        
    /**
    * определение новый ли пользователь зашел на сайт
    * на основе значений cookie
    * @return true если пользователь новый иначе false
    **/
    isUserNew: function(){
        var result = false;
        result = result || ( this.getCookie('user') == 'undefined' );
        result = result || ( this.getCookie('user_id') == 'undefined' );
        result = result || ( this.getCookie('user') == undefined );
        result = result || ( this.getCookie('user_id') == undefined );
        return result;
    },
    
    /**
    * определение есть пользователь с таким id  в игре
    * @param game объект игры
    * param user_id id пользователя
    * @return true/false
    **/
    isUserIdPresent: function(game, user_id){
        for ( var i = 0; i < game.users.length; i++ ){
            if ( game.users[i].id == user_id ) return true;
        }
        return false;
    } 
    
}

