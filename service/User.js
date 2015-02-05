// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('User');
var Promise = require('bluebird');
var Schemas = require("../schemas.js");
var UserDao= require('../dao/userDao.js');

var User = function (data, isNoSchemas) {
    var _data=_.initial([]);
    var schema=new Schemas('user');
    if (_.isUndefined(isNoSchemas)){// 스키마 미사용
        _data = schema.get(data);
    } else if (!_.isUndefined(isNoSchemas)||isNoSchemas){
        _data=data;
    }
    
    debug(data);
    
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
    var _getManagerList = function(id){
        return UserDao.selectManagerList(id);
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
    var _editUser=function(){
        var _user=this;
        return new Promise(function(resolve, reject){// promise patten
            _getUser().then(function(currentData){
                debug(currentData);
                var _updateData=_.defaults(_data, currentData[0]);
                UserDao.updateUser(_updateData).then(function(result){
                    resolve(result);
                }).catch(function(e){
                    debug("_editUser ERROR:"+e.message);
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("_getUser ERROR:"+e.message);
               reject(e);
            });
        });
    }
    var _configUser=function(){
        var _user=this;
        return new Promise(function(resolve, reject){// promise patten
            _getUser().then(function(currentData){
                debug(currentData[0]);
                if (currentData[0].password!=_data.password){
                    debug("_configUser ERROR:Not equls Password");
                    throw new Error("NOT_EQULES_PASSWORD");
                }
                _data.password=_data.new_password;
                var _updateData=_.defaults(_data, currentData[0]);
                debug(_updateData);
                UserDao.updateUser(_updateData).then(function(result){
                    resolve(result);
                }).catch(function(e){
                    debug("_editUser ERROR:"+e.message);
                    reject(e);
                });
            }).catch(function(e){//Connection Error
               debug("_getUser ERROR:"+e.message);
               reject(e);
            });
        });
    };
    var _findPassword=function(){
        var _user=this;
        return new Promise(function(resolve, reject){// promise patten
            _getUser().then(function(currentData){
                if (_.isUndefined(currentData[0])){
                    throw new Error("DO_NOT_FOUND_USER");
                }
                if (currentData[0].email!=_data.email){ //입력받은 이메일이 적확하지 않을 때.
                    debug("_configUser ERROR:Not equls Email");
                    throw new Error("NOT_EQULES_EMAIL");
                } else {
                    resolve(currentData[0]);
                }
            }).catch(function(e){//Connection Error
               debug("_getUser ERROR:"+e.message);
               reject(e);
            });
        });
    };
    return {
        get:_get,
        getUser:_getUser,
        getUserList:_getUserList,
        getManagerList:_getManagerList,
        initPassword:_initPassword,
        data:_data,
        remove:_removeUser,
        addUser:_addUser,
        editUser:_editUser,
        configUser:_configUser,
        findPassword:_findPassword
    }
}
module.exports = User;

