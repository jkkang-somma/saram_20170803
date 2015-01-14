// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
var UserDao= require('../dao/userDao.js');

var User = function (data) {
    var _data=_.initial([]);
    var schema=new Schemas('user');
    _data = schema.get(data);
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    }
    var _getUser = function () {//select user;
        return UserDao.selectIdByUser(_data.id);
    }
    var _getUserList = function(){
        return UserDao.selectUserList();
    }
    var _getManagerList = function(){
        return UserDao.selectManagerList();
    }
    var _initPassword = function(){
        return UserDao.initPassword(_data.id, _data.password);
    }
    var _removeUser=function(){
        return UserDao.deleteUser(_data.id);
    }
    var _addUser=function(){
       return UserDao.insertUser(_data); 
    }
    return {
        get:_get,
        getUser:_getUser,
        getUserList:_getUserList,
        getManagerList:_getManagerList,
        initPassword:_initPassword,
        data:_data,
        remove:_removeUser,
        addUser:_addUser
    }
}

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = User;

