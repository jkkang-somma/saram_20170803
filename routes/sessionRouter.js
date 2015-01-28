var express = require('express');
var _ = require("underscore"); 
var sessionManager = require('../lib/sessionManager');
var Session = require('../service/Session');
var debug = require('debug')('sessionRouter');
var router = express.Router();
var User = require('../service/User.js');
var encryptor = require('../lib/encryptor.js');
var suid =  require('rand-token').suid;

var sessionResponse=function(req, res, session){
    if (_.isUndefined(session)||_.isNull(session)){
        res.send(new Session({isLogin:false, id:req.session.id}));
    } else {
        res.send(session);
    }
};
router.route('/')
.post(function(req, res){//만들기.
    if (req.cookies.saram) {//cookie가 있을 때.
        if (sessionManager.validationCookie(req.cookies.saram, res)){
            debug("@@@@@@@@@@@@@@");
            sessionResponse(req, res, sessionManager.get(req.cookies.saram));
            debug("@@@@@@@@@@@@@@");
        } else {//유효하지 않은 cookie 삭제.
            sessionManager.remove(req.cookies.saram);
            res.clearCookie("saram");
            sessionResponse(req, res);
        }
    } else {// 아예 세션 정보가 없을 때.
        sessionResponse(req, res);
    }
    
    sessionManager.poolCount(req.session.id);
})
.put(function(req, res){//login 부분 
    var user = new User(req.body.user);
    var session;
    var msg;
    
    if (!_.isUndefined(req.body.initPassword) && req.body.initPassword){
        user.initPassword().then(function(){
            msg="SUCCESS_INIT_PASSWORD";
            sessionResponse(req, res, new Session({isLogin:false, id:req.session.id, msg:msg}));
        }).catch(function(e){
            debug("Exception:" + e);
        });
    } else {
        user.getUser().then(function(result){
            if (result.length == 0){
                debug("find user zero.");
                msg="DO_NOT_FOUND_USER";
                session=new Session({isLogin:false, id:req.session.id,msg:msg});
            } else {
                var resultUser= new User(result[0]);
                debug(resultUser.get("password"));
                if (_.isEmpty(resultUser.get("password"))||_.isNull(resultUser.get("password"))){ //password 초기화 안된경우 
                    debug("not init password");
                    msg="INIT_PASSWORD";
                    session=new Session({isLogin:false, id:req.session.id, msg:msg, initPassword:true, user:{id:resultUser.get("id")}});
                } else {
                    if (user.get("password")==resultUser.get("password")){
                        debug("login success");
                        
                        var hour = 3600000000000;
                        var accessToken = suid(32);
                        
                        var userInfo = resultUser.data;
                        userInfo.password="";
                        
                       
                        session =new Session({isLogin:true, id:req.session.id, user:userInfo, auth:"default", ACCESS_TOKEN:accessToken});
                        
                        res.cookie('saram', session, { maxAge: hour, httpOnly: false });
                        sessionManager.add(session, accessToken);
                        
                        
                        /*
                        * auth 관련 셋팅 로직 구현 필요
                        */
                    } else {
                        debug("not equle password.");
                        msg="NOT_EQULES_PASSWORD";
                        session=new Session({isLogin:false, id:req.session.id, msg:msg});
                    }          
                }
            }
            sessionResponse(req, res, session);
        }).catch(function(e) {
            
            debug("Exception:" + e);
        });
    }
    
}).delete(function(req, res){
    sessionManager.remove(req.cookies.saram);
    req.session.destroy(function(){
        
    });
    res.clearCookie("saram");
    res.send({});
});

module.exports = router;
