var express = require('express');
var _ = require("underscore"); 
var sessionManager = require('../lib/sessionManager');
var Session = require('../service/Session');
var debug = require('debug')('sessionRouter');
var router = express.Router();
var User = require('../service/User.js');
var encryptor = require('../lib/encryptor.js');

var sessionResponse=function(req, res, session){
    if (_.isUndefined(session)||_.isNull(session)){
        res.send(new Session({isLogin:false, id:req.session.id}));
    } else {
        res.send(session);
    }
};
router.route('/')
.get(function(req, res){// 이거 왜하지 ---? client에서 세션 정보 필요할때.
    if (sessionManager.hasSession(req.session.id)){ // 세션이 유효하지 않을 때
        sessionResponse(sessionManager.get(req.session.id));
    } else {
        sessionResponse(req, res);
    } 
    
})
.post(function(req, res){//만들기.
    if (sessionManager.hasSession(req.session.id)){ // 세션이 유효하지 않을 때
        sessionResponse(sessionManager.get(req.session.id));
    } else {
        sessionResponse(req, res);
    } 
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
                        
                        var hour = 3600000
                        res.cookie('saram', {
                            user:resultUser,
                            auth:"default"
                            //expire:
                        }, { maxAge: hour, httpOnly: false });
                        
                        session =new Session({isLogin:true, id:req.session.id, user:resultUser.data})
                        sessionManager.add(session);
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
    
});

router.route('/:id')
.delete(function(req, res){
    req.session.regenerate(function(err){
        res.send({login: false});
    });
});

module.exports = router;
