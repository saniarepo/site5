/*отправка AJAX запроса нативным JS*/
var Ajax = 
{
    /*получение объекта XMLHttpRequest*/
    getXMLHttp: function(){
        var xmlHttp
        try
        {
            //Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        }catch(e){
            //Internet Explorer
            try{
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                }catch(e){
                try{
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                    alert("Your browser does not support AJAX!");
                    return false;
                }
            }
        }
        return xmlHttp;
    },

    /**
    * отправка запроса
    * @param method метод запроса
    * @param url
    * @param params
    * callback  
    **/
    sendRequest: function(method, url, params, callback){
        XMLHttp = Ajax.getXMLHttp();
        if( method == 'GET' || method == 'get' ){
			url += '?' + params;
		}
		XMLHttp.open(method, url, true);
        XMLHttp.onreadystatechange = function(){
            if ( XMLHttp.readyState == 4 ){
                if ( XMLHttp.status == 200 ){
                    callback(JSON.parse(XMLHttp.responseText));
                }
                else{
                    callback(null);
                }
            }
        };
        if( method == 'POST' || method == 'post' ){
            XMLHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            XMLHttp.send(params);
        }else{
            XMLHttp.send(null);
        }
    }
    
};