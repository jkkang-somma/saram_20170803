// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var MessageDao= require('../dao/messageDao.js');

var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');

var Message = function (data) {
    function _getMessage(){
        return MessageDao.getMessage();
    }
    
    function _setMessage(data){
        return MessageDao.setMessage(data)
    }
    
    return {
        getMessage : _getMessage,    
        setMessage : _setMessage
    };
};

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = new Message();

