/**
* конструктор объекта User
* @param id игрока
* @param name имя игрока 
**/
function User(id,name)
{
    /*свойства*/
    this.id = id;
    this.name = name; /*имя*/
    this.gameId = 0; /* id игры*/
    
    /**
    * преобразование в объект, который можно преобразовать в строку
    **/
    this.toString = function(){
        return { id: this.id, name: this.name, gameId: this.gameId };  
    };
    
}