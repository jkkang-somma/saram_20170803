// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// SessionManager

//import module
var _ = require("underscore"); 
var debug = require('debug')('SessionManager');

var SessionManager = function () {
    var _sessionPool=_.initial([]);
    var _add=function (session) {
        debug('Add User Session :'+ session.user.id);
        _sessionPool.push(session);    
    };
    var _remove = function (session) {
        //underscore reject 조건을 만족하는 elements를 제외한 배열을 반환한다.
        debug('Remove User Session :'+ session.user.id);
        _sessionPool=_.reject(_sessionPool, function(findSession){
            return  session.id==findSession.id;
        }); 
    };
    var _get = function (session) {
        //underscore find 조건을 만족하는 제일 먼저 나온 value 를 리턴한다. 찾지 못할때는 undefined 를 리턴.
        return _.find(_sessionPool,function(findSession){
            return session.id==findSession.id;
        });
    };
    
    var _hasSession =function(sessionId){
        return _.find(_sessionPool,function(findSession){
            return sessionId==findSession.id;
        });
    };
    
    return {
        add:_add,
        remove:_remove,
        get:_get,
        hasSession:_hasSession
    }
}
module.exports = new SessionManager();