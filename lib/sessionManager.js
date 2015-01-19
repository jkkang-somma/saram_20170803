// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// SessionManager

//import module
var _ = require("underscore"); 
var debug = require('debug')('SessionManager');

var SessionManager = function () {
    //  session:{
    //         user:null,
    //         id:null,
    //         auth:null,
    //         isLogin:false,
    //         initPassword:false,
    //         msg:null,
    //         ACCESS_TOKEN:null
    //     },
    
    
    var _nomalSessionPool=_.initial([]);
    var _loginSessionPool=_.initial([]);
    
    
    var _validationCookie=function(saram){
        var _result= false;
        var _ACCESS_TOKEN=saram.ACCESS_TOKEN;
        var _session=_.find(_loginSessionPool, function(loginSession){// 로그인 세션 풀에서 해당 토큰으로 찾음.
            return loginSession.ACCESS_TOKEN == _ACCESS_TOKEN;
        })
        
        if (!_.isUndefined(_session)){//login Session이 있을 때. 
            var _expireTime=_session.EXPIRE_DATE;
            var _nowTime=new Date().getTime()/1000;
            
            debug("##############validationCookie##########################");
            debug("_expireTime:"+_expireTime);
            debug("_nowTime:"+_nowTime);
            debug("result:"+_expireTime > _nowTime);
            if (_expireTime > _nowTime){//Token 유효기간 체크.
                _result=true;
            }
        }
        return _result; 
    };
    
    var _add=function (session) {
        debug('Add User Session :'+ session.user.id);
        var _now=new Date();
        _now.setHours(_now.getHours() + 1); //6시간
        
        // _now=new Date(_now.getTime() + (10 * 1000));
        var _expireTime=_now.getTime()/1000;
        
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
        debug("#####################################################");
        debug("current session Totall:" + _nomalSessionPool.length)
        debug("#####################################################");
        
        debug("#####################################################");
        debug("Login session Totall:" + _loginSessionPool.length)
        debug("#####################################################");
    }
    return {
        add:_add,
        remove:_remove,
        get:_get,
        hasSession:_hasSession,
        poolCount:_poolCount,
        validationCookie:_validationCookie,
    }
}
module.exports = new SessionManager();