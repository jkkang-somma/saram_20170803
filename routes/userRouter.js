// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
var express = require('express');
var debug = require('debug')('userRouter');
var router = express.Router();
var _ = require("underscore"); 
var User = require('../service/User.js');


//사용자 목록 조회.
router.route('/list')
.get(function(req, res){
    // Get user infomation list (GET)
    var user = new User();
    var result = user.getUserList().then(function(result){
        debug("Complete Select User List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select User List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});
//사용자 목록 조회(관리자).
router.route('/list/manager')
.get(function(req, res){
    // Get user infomation list (GET)
    var user = new User();
    var result = user.getManagerList().then(function(result){
        debug("Complete Select User List.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select User List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});
//사용자 정보 조회
router.route('/:id')
.get(function(req, res){
    var _id=req.param("id");
    var user = new User({id:_id});
    user.getUser().then(function(result){
        debug("Complete Select User.");
        res.send(result);
    }).catch(function(e){
        debug("Error Select User.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
    
})//사용자 수정
.put(function(req, res){
    var user = new User(req.body);
    user.editUser().then(function(result){
        res.send(result);
    }).catch(function(e){
        debug("Error initPassword.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})//사용자 삭제
.delete(function(req, res){
    var _id=req.param("id");
    var user = new User({id:_id});
    user.remove().then(function(){
        debug("Complete Delete User.");
        res.send({success:true, message:"Complete Delete User."});
    }).catch(function(e){
        debug("Error Delete User.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

//사용자 등록
router.route('/')
.post(function(req, res){
    debug("사용자 등록:");
    var user = new User(req.body);
    debug("ID:" + user.get("id"));
    
    user.addUser().then(function(e){
        debug("Complete Add User.");
        res.send({success:true, msg:"Complete Add User."})
    }).catch(function(e){
        debug("Error Add User.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});
module.exports = router;
