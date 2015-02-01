/*опции для работы с БД MySQL*/
var db_options = { 
                    host: 'localhost', 
                    user: 'root', 
                    password: 'root',
                    
                };
                
var db_name = 'elevation';
var db_dump = __dirname + '/db_dump.sql';

exports.db_options = db_options;
exports.db_name = db_name;
exports.db_dump = db_dump;