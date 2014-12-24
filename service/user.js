var debug = require('debug')('/service/user');
var util = require('util');
var db = require('../lib/dbmanager.js');
var encryptor = require('../lib/encryptor.js');

exports.selectUserAll = function(callback, req){
    var queryStr = db.getQuery('user', 'select_user_all');
    db.query(queryStr, callback);
};

exports.selectUser = function(callback, id){
    var queryStr = util.format(db.getQuery('user', 'select_user'), id);
    db.query(queryStr, callback);
};


exports.insertUser = function(callback, req){
    var param = req.body;

    var id = param.id;
    var name = param.name;
    var department = param.department;
    var nameCommute = param.nameCommute;
    var joinDate = param.joinDate;
    
    var queryStr = util.format(db.getQuery('user', 'add_user') , id, name, department, nameCommute, joinDate);
    
    db.query(queryStr, callback);
    
};

exports.updatePassword = function(callback, req){
    var param = req.body;
    
    var id = param.id;
    var password = param.password;
    
    var queryStr = util.format(db.getQuery('user', 'update_password') , encryptor.encrypte(password), id ); 
    db.query(queryStr, callback);

};
