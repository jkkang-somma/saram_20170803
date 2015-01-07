// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
var VacationDao= require('../dao/vacationDao.js');

//var User = function (data) {
//    var _data=_.initial([]);
//    var schema=new Schemas('user');
//    _data = schema.get(data);
//    var _get = function (fieldName) {
//        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
//        if (_.has(_data, fieldName)){
//            return _data[fieldName];
//        } else {
//            return _.noop;
//        }
//    }
//    var _getUser = function () {//select user;
//        return UserDao.selectIdByUser(_data.id);
//    }
//    var _getUserList = function(){
//        return UserDao.selectUserList();
//    }
//    return {
//        get:_get,
//        getUser:_getUser,
//        getUserList:_getUserList,
//        data:_data
//    }
//}

var Vacation = function(data) {
	console.log("Vacation" + data.year);
	var _getVacation = function() {
		var result = VacationDao.selectVacationsByYear(data.year);
		
		console.log("결과 ");
		console.log(result);
		return result;;
	};
	
	return {
		getVacation : _getVacation
	}
} 

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Vacation;


// exports.getUserList = function(callback, req){
    
//     return new Promise(function(){
        
//     });
// };

// exports.getUser = function(callback, id){
//     // var queryStr = util.format(db.getQuery('user', 'select_user'), id);
//     // db.query(queryStr, callback);
// };

// exports.addUser = function(callback, req){
//     // var param = req.body;

//     // var id = param.id;
//     // var name = param.name;
//     // var department = param.department;
//     // var nameCommute = param.nameCommute;
//     // var joinDate = param.joinDate;
    
//     // var queryStr = util.format(db.getQuery('user', 'add_user') , id, name, department, nameCommute, joinDate);
    
//     // db.query(queryStr, callback);
    
// };

// exports.changePassword = function(callback, req){
//     // var param = req.body;
    
//     // var id = param.id;
//     // var password = param.password;
    
//     // var queryStr = util.format(db.getQuery('user', 'update_password') , encryptor.encrypte(password), id ); 
//     // db.query(queryStr, callback);

// };
