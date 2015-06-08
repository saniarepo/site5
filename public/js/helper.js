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
    },
    
    /**
    * решение обратной геодезической задачи на сфере
    * определение расстояния между точками и азимута с первой на вторую
    * @param do1,dot2 точки, заданные массивами кооординат [lat,lng]
    * @return объект {dist: dist, azimut: azimut}
    **/
    ogz: function(dot1,dot2){
        /**pi - число pi, rad - радиус сферы (Земли)**/
        var rad = 6372795;
    
    	/**координаты двух точек**/
    	var llat1 = dot1[0];
    	var llong1 = dot1[1];
    
    	var llat2 = dot2[0];
    	var llong2 = dot2[1];
    
    	/**в радианах**/
    	var lat1 = llat1*Math.PI/180;
    	var lat2 = llat2*Math.PI/180;
    	var long1 = llong1*Math.PI/180;
    	var long2 = llong2*Math.PI/180;
    
    	/**косинусы и синусы широт и разницы долгот**/
    	var cl1 = Math.cos(lat1);
    	var cl2 = Math.cos(lat2);
    	var sl1 = Math.sin(lat1);
    	var sl2 = Math.sin(lat2);
    	var delta = long2 - long1;
    	var cdelta = Math.cos(delta);
    	var sdelta = Math.sin(delta);
    
    	/**вычисления длины большого круга**/
    	var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2));
    	var x = sl1*sl2+cl1*cl2*cdelta;
    	var ad = Math.atan2(y,x);
    	var dist = ad*rad;
        /**вычисление начального азимута**/
         x = (cl1*sl2) - (sl1*cl2*cdelta);
         y = sdelta*cl2;
         z = (Math.atan(-y/x)) * 180 / Math.PI;
         
         if (x < 0) z += 180;
         
         z2 = (z+180) % 360 - 180;
         z2 = - (Math.PI) /180 * (z2);
         anglerad2 = z2 - ((2*Math.PI)*Math.floor((z2/(2*Math.PI))) );
         angledeg = (anglerad2*180)/Math.PI;
         return {dist: dist, azimut: angledeg};
    },
    
    /**
    * решение прямой геодезической задачи на сфере
    * дано расстояние между точками и азимут с первой на вторую
    * найти координаты второй точки
    * @param dot начальная точка заданная массивом координат [lat, lng]
    * @param dist расстояние до конечной точки
    * @param az азимут на конечную точку
    * @return dot2 массив кооординат второй точки [lat,lng]
    **/
    
     pgz: function (dot, dist, az){
    	//console.log(dot,dist,az);
    	var rad = 6372795;
    	var pt1 = [0,0];
    	pt1[0] = Helper.Radians(dot[0]);
    	pt1[1] = Helper.Radians(dot[1]);
    	var pt2 = Helper.SphereDirect(pt1, Helper.Radians(az), dist / rad);
    	var dot2 = [0,0];
    	dot2[0] = Helper.Degrees(pt2[0]);
    	dot2[1] = Helper.Degrees(pt2[1]);
    	return dot2;
    },

    Radians: function (x){
    	return x / 180 * Math.PI;
    },

    Degrees:function (x){
    	return x * 180 / Math.PI;
    },

    Rotate: function (x, a, i){
    	var c, s, xj;
    	var j, k;
    	j = (i + 1) % 3;
    	k = (i - 1) % 3;
    	c = Math.cos(a);
    	s = Math.sin(a);
    	xj = x[j] * c + x[k] * s;
    	x[k] = -x[j] * s + x[k] * c;
    	x[j] = xj;
    	return x;
    },

    SpherToCart: function (y){
    	var p;
    	var x = [0,0,0];
    	p = Math.cos(y[0]);
    	x[2] = Math.sin(y[0]);
    	x[1] = p * Math.sin(y[1]);
    	x[0] = p * Math.cos(y[1]);
    	return x;
    },

    CartToSpher: function (x){
    	var p;
    	var y = [0,0];
    	p = Math.sqrt(x[0] * x[0] + x[1] * x[1]);
    	y[1] = Math.atan2(x[1], x[0]);
    	y[0] = Math.atan2(x[2], p);
    	return y;
    	//return sqrt(p * p + x[2] * x[2]);
    },

    SphereDirect: function (pt1, azi, dist){
      var pt=[]; 
      var x=[];
      pt.push(Math.PI/2 - dist);
      pt.push(Math.PI - azi);
      x = Helper.SpherToCart(pt);
      x = Helper.Rotate(x, pt1[0] - Math.PI/2, 1);
      x = Helper.Rotate(x, -pt1[1], 2);
      pt2 = Helper.CartToSpher(x);
      return pt2;
    },
    
    /**
    * вычисление расстояния на сфере  в градусах
    * @param do1,dot2 точки, заданные массивами кооординат [lat,lng]
    **/
    rastGrad: function(dot1,dot2){
    /**pi - число pi, rad - радиус сферы (Земли)**/
        var rad = 6372795
    
    	/**координаты двух точек**/
    	var llat1 = dot1[0];
    	var llong1 = dot1[1];
    
    	var llat2 = dot2[0];
    	var llong2 = dot2[1];
    
    	/**в радианах**/
    	var lat1 = llat1*Math.PI/180;
    	var lat2 = llat2*Math.PI/180;
    	var long1 = llong1*Math.PI/180;
    	var long2 = llong2*Math.PI/180;
    
    	/**косинусы и синусы широт и разницы долгот**/
    	var cl1 = Math.cos(lat1)
    	var cl2 = Math.cos(lat2)
    	var sl1 = Math.sin(lat1)
    	var sl2 = Math.sin(lat2)
    	var delta = long2 - long1
    	var cdelta = Math.cos(delta)
    	var sdelta = Math.sin(delta)
    
    	/**вычисления длины большого круга**/
    	var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2))
    	var x = sl1*sl2+cl1*cl2*cdelta
    	var ad = Math.atan2(y,x)
    	var dist = ad*180/Math.PI;
    	return dist;
    },
    
     /**
    * вычисление расстояния на сфере
    * @param do1,dot2 точки, заданные массивами кооординат [lat,lng]
    **/
    rast: function(dot1,dot2){
    /**pi - число pi, rad - радиус сферы (Земли)**/
        var rad = 6372795
    
    	/**координаты двух точек**/
    	var llat1 = dot1[0];
    	var llong1 = dot1[1];
    
    	var llat2 = dot2[0];
    	var llong2 = dot2[1];
    
    	/**в радианах**/
    	var lat1 = llat1*Math.PI/180;
    	var lat2 = llat2*Math.PI/180;
    	var long1 = llong1*Math.PI/180;
    	var long2 = llong2*Math.PI/180;
    
    	/**косинусы и синусы широт и разницы долгот**/
    	var cl1 = Math.cos(lat1)
    	var cl2 = Math.cos(lat2)
    	var sl1 = Math.sin(lat1)
    	var sl2 = Math.sin(lat2)
    	var delta = long2 - long1
    	var cdelta = Math.cos(delta)
    	var sdelta = Math.sin(delta)
    
    	/**вычисления длины большого круга**/
    	var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2))
    	var x = sl1*sl2+cl1*cl2*cdelta
    	var ad = Math.atan2(y,x)
    	var dist = ad * rad;
        return dist;
    } 
    
}



