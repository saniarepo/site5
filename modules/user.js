/*конструктор объекта User*/
function User(id)
{
    this.id = id;
    this.name = '';
    this.last = new Date();
    this.lastTime = this.last.getTime();
    this.toString = function(){
        return {id: this.id, name: this.name, lastTime: this.lastTime, loser: this.loser};  
    };
    this.loser;
    
}

exports.User = User;