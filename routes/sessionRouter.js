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
    var session;
    var reqSession = req.session.Session;
    if(_.isUndefined(reqSession)){//세션이 셋팅 되지 않았을때
        sessionResponse(req, res);
    }else{
        if (sessionManager.hasSession(reqSession.id)){ // 세션이 유효하지 않을 때
            sessionResponse(sessionManager.get(reqSession));
        } else {
            req.session.Session=_.noop;
            sessionResponse(req, res);
        } 
    }
}).put(function(req, res){//login 부분 
    var user = new User(req.body.user);
    user.getUser().then(function(result){
        var session;
        var msg;
        if (result.length == 0){
            debug("find user zero.");
            msg="DO_NOT_FOUND_USER";
            session=new Session({msg:msg});
        } else {
            var resultUser= new User(result[0]);
            if (_.isNull(resultUser.get("password"))){ //password 초기화 안된경우 
                debug("not init password");
                msg="INIT_PASSWORD";
                session=new Session({id:req.session.id, init:resultUser.get("id"), msg:msg});
            } else {
                if (user.get("password")==resultUser.get("password")){
                    debug("login success");
                    
                    session =new Session({isLogin:true, id:req.session.id, user:resultUser.data})
                    sessionManager.add(session);
                    req.session.Session=session;
                    /*
                    * auth 관련 셋팅 로직 구현 필요
                    */
                } else {
                    debug("not equle password.");
                    session=new Session({msg:msg});
                }          
            }
        }
        sessionResponse(req, res, session);
    }).catch(function(e) {
        
        debug("Exception:" + e);
    });
    
    // user.selectUser(function(result){
    //     debug(result);
    //     if(result.length === 0){
    //         // can`t find id
    //         res.send({login: false, msg: "Can`t find ID"});
    //     }else{
    //         if(result[0].password === '' || result[0].password === null){
    //             res.send({login: false, init: loginid});
    //         }else{
    //             //encrypte 안맞음
    //             debug(result[0].password);
    //             debug(encryptor.encrypte(password));
    //             if(true){//result[0].password == encryptor.encrypte(password)){
    //                 debug('login Success!!');
    //                 req.session.loginid = loginid;
    //                 res.send({login: true, id : req.session.id, loginid: req.session.loginid});
                    
    //             }else{
    //                 res.send({login: false, msg: "incorrect password"});
    //             }
    //         }
    //     }
    // }, loginid);
    
});

router.route('/:id')
.delete(function(req, res){
    req.session.regenerate(function(err){
        res.send({login: false});
    });
});

module.exports = router;
