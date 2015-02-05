// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// SessionManager

//import module
var _ = require("underscore"); 
var debug = require('debug')('APIManager');
var suid =  require('rand-token').suid;

var APIManager = function () {
    var _APIPool=_.initial([]);
    var _createAPIToken=function(){//토큰 생성
        return suid(32);
    };
    
    // var accessAPI={
    //     token:accessToken,
    //     url:"/session/resetPassword",
    //     user:result,
    //     expire
    // };
    
    var _add=function(accessAPI){//API 정보 Add
        if (!_hasAPI(accessAPI)){
            debug('Add User API :'+ accessAPI.user.id);
            var now=new Date();
            now.setSeconds(now.getSeconds() + 3600);//expire time 은 1시간 기본으로 한다.
            var expireTime=Math.round(now.getTime() / 1000);
            accessAPI.expire=expireTime;
            _APIPool.push(accessAPI);    
        }
    }
    var _remove=function(accessAPI){//API 정보 remove
        debug('Remove User API :'+ accessAPI.user.id);
        _APIPool=_.reject(_APIPool, function(findAPI){
           return accessAPI.token==findAPI.token;
        });
    }
    var _hasAPI=function(accessAPI){//해당 사용자의 API가 사용중인지 확인.
        var findArr=_.find(_APIPool, function(findAPI){
            return accessAPI.url==findAPI.url&&accessAPI.user.id==findAPI.user.id;
        });
        
        if (_.isUndefined(findArr)){
            return false;
        } else {
            return true;
        }
    };
    var _get=function(token){
		
        var findArr=_.find(_APIPool, function(findAPI){
            return token==findAPI.token;
        });
        
        if (_.isUndefined(findArr)){// API 없음
            return {
                isValid:false,
                message:"401 접근권한이 없습니다."
            }   
        } else {
            var findAPI=findArr;
            if (_validation(findAPI)){
                findAPI.isValid=true;
                return findAPI;
            } else {
                return {
                    isValid:false,
                    message:"유효시간이 만료되었습니다.(*만료시간은 요청후 1시간입니다.)"
                }   
            }  
        }   
    }
    
    var _validation=function(accessAPI){
        var nowTime=Math.round(new Date().getTime()/1000);
        return (accessAPI.expire > nowTime);
    }
    var _celarAPI=function(){//사용 시간 지난 API 삭제
        debug('_celarAPI User API :');
        _APIPool=_.reject(_APIPool, function(findAPI){
            var result=false;
            var expireTime=findAPI.expire;
            var nowTime=Math.round(new Date().getTime()/1000);
            if (nowTime > expireTime){
                result=true;
            }
            return result;
        });
    }
    return {
        newToken:_createAPIToken,
        add:_add,
        remove:_remove,
        get:_get
    }
}
module.exports = new APIManager();