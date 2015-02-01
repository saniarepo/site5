/*модуль для хранения серверных объектов game и user*/
var Game = require('./game').Game; 
var User = require('./user').User;

var game = null; /*переменная для хранения серверного объекта game*/
var users = []; /*массив для хранения объектов user*/
var USER_MAX = 2; /*максимальное количество пользователей*/
var MISSIONS_FOLDER = 'missions'; /*каталог с миссиями*/

/**
* добавление нового user в массив
* @param user объект user
* @return true или false
**/
function addUser(user){
    if ( users.length >= USER_MAX ) return false;
    for ( var i = 0; i < users.length; i++ ){
        if ( users[i].id == user.id && users[i].name == user.name )
            return false;
    }
    
    for ( var i = 0; i < users.length; i++ ){
        if ( users[i].id == user.id ){
            users[i].name = user.name;
            return true;
        }        
    }
    users.push(user);
}

/**
* получение имени user по id
* @param userId id
* @return id или undefined 
**/
function getUserName(userId){
    for ( var i = 0; i < users.length; i++ ){
        if ( users[i].id == userId ) return users[i].name;
    }
    return undefined;
}

/**
* удаление user ов
**/
function clearUsers(){
    while( users.length != 0 ){
        delete users[0];
        users.splice(0,1);
    }
}

/**
* получение имени каталога с миссиями
**/
function getMissionsDir(){
    return MISSIONS_FOLDER;
}

exports.game = game;
exports.Game = Game;
exports.User = User;
exports.addUser = addUser;
exports.getUserName = getUserName;
exports.clearUsers = clearUsers;
exports.getMissionsDir = getMissionsDir;