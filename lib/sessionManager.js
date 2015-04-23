// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// SessionManager

//import module
var _ = require("underscore"); 
var debug = require('debug')('session');

var SessionManager = function () {
    var _nomalSessionPool=_.initial([]);
    var _loginSessionPool=_.initial([]);
    
    
    var _validationCookie=function(saram, res){
        var _result= false;
        var _ACCESS_TOKEN=saram.ACCESS_TOKEN;
        var _session=_.find(_loginSessionPool, function(loginSession){// 로그인 세션 풀에서 해당 토큰으로 찾음.
            return loginSession.ACCESS_TOKEN == _ACCESS_TOKEN;
        });
        
        if (!_.isUndefined(_session)){//login Session이 있을 때. 
            var _expireTime=_session.EXPIRE_DATE;
            var _nowTime=new Date();
            var _unixNowTime=Math.round(_nowTime.getTime()/1000);
            
            // debug("########### Validation Cookie ###########");
            // debug("_expireTime:"+_expireTime +" _nowTime:"+_unixNowTime);
            // debug("result:"+(_expireTime > _unixNowTime));
            if (_expireTime > _unixNowTime){//Token 유효기간 체크.
               _result=true;
               
              _nowTime.setSeconds(_nowTime.getSeconds() + 3600);
              var _reExpireTime=Math.round(_nowTime.getTime()/1000);
              _session.EXPIRE_DATE=_reExpireTime;
            //   debug("_reExpireTime:"+_reExpireTime);
               
               debug("Update token Expire Time("+_session.user.id+")");
               
              var hour = 3600000000000;
              res.cookie('saram', _session, { maxAge: hour, httpOnly: false });
              _update(_session);
              
            }
        }
        
        return _result; 
    };
    
    var _add=function (session) {
        debug('Add User Session :'+ session.user.id);
        var _now=new Date();
        _now.setSeconds(_now.getSeconds() + 3600);
        var _expireTime=Math.round(_now.getTime() / 1000);
        
        //Token expire Time
        session.EXPIRE_DATE=_expireTime;
        _loginSessionPool.push(session);    
    };
    
    var _get = function (session) {
        //underscore find 조건을 만족하는 제일 먼저 나온 value 를 리턴한다. 찾지 못할때는 undefined 를 리턴.
        return _.find(_loginSessionPool, function(findSession){
            return session.ACCESS_TOKEN==findSession.ACCESS_TOKEN;
        });
    };
    
    var _update =function(session){
        _.find(_loginSessionPool, function(findSession){
            if (session.ACCESS_TOKEN==findSession.ACCESS_TOKEN){
                findSession.EXPIRE_DATE=session.EXPIRE_DATE;
            }
            return session.ACCESS_TOKEN==findSession.ACCESS_TOKEN;
        });
    };
    
    var _remove = function (session) {
        //underscore reject 조건을 만족하는 elements를 제외한 배열을 반환한다.
        debug('Remove User Session :'+ session.user.id);
        _loginSessionPool=_.reject(_loginSessionPool, function(findSession){
            return  session.ACCESS_TOKEN==findSession.ACCESS_TOKEN;
        }); 
    };
    
    var _hasSession =function(sessionId){
        return _.find(_loginSessionPool, function(findSession){
            return sessionId==findSession.id;
        });
    };
    var _poolCount = function(sessionId){
        if (-1 == _.indexOf(_nomalSessionPool, sessionId)){
            _nomalSessionPool.push(sessionId);
        }
        debug("current session Total:" + _nomalSessionPool.length);
        debug("Login session Total:" + _loginSessionPool.length);
    };
    return {
        add:_add,
        remove:_remove,
        get:_get,
        hasSession:_hasSession,
        poolCount:_poolCount,
        validationCookie:_validationCookie,
    };
};
module.exports = new SessionManager();