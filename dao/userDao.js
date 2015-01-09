var debug = require('debug')('userDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var UserDao = function () {
}
UserDao.prototype.selectIdByUser =  function (id) {//select user;
    var queryStr = util.format(db.getQuery('user', 'selectIdByUser'), id);
    return db.query(queryStr);
}

UserDao.prototype.selectUserList =  function () {//select user;
    var queryStr = db.getQuery('user', 'selectUserList');
    return db.query(queryStr);
}
UserDao.prototype.initPassword =  function (id, password) {
    var queryStr = util.format(db.getQuery('user', 'initPassword'), password, id);
    return db.query(queryStr);
}
UserDao.prototype.deleteUser = function(id){
    var queryStr = util.format(db.getQuery('user', 'deleteUser'), id);
    return db.query(queryStr);
}
module.exports = new UserDao();


// exports.selectUserAll = function(callback, req){
//     var queryStr = db.getQuery('user', 'select_user_all');
//     db.query(queryStr, callback);
// };

// exports.selectUser = function(callback, id){
//     var queryStr = util.format(db.getQuery('user', 'select_user'), id);
//     db.query(queryStr, callback);
// };


// exports.insertUser = function(callback, req){
//     var param = req.body;

//     var id = param.id;
//     var name = param.name;
//     var department = param.department;
//     var nameCommute = param.nameCommute;
//     var joinDate = param.joinDate;
    
//     var queryStr = util.format(db.getQuery('user', 'add_user') , id, name, department, nameCommute, joinDate);
    
//     db.query(queryStr, callback);
    
// };

// exports.updatePassword = function(callback, param){
//     var queryStr = util.format(db.getQuery('user', 'update_password') , param.password, param.id); 
//     db.query(queryStr, callback);

// };
