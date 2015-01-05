var express = require('express');
var debug = require('debug')('userRouter');
var router = express.Router();
var User = require('../service/User.js');


router.route('/')
.get(function(req, res){
    // Get user infomation list (GET)
    var result = User.getUserList();
    debug(result);
    res.send(result);    
    
}).post(function(req, res){
    // // Insert user infomation (PUT)
    // debug(req.body);
    // userService.insertUser(function(result){
    //     res.send(result);
    // }, req);
    
});


router.route('/:user_id')
.get(function(req, res){
    // // Get user infomation (GET)
    // userService.selectUser(function(result){
    //     res.send(result);
    // }, req.param.name);
    
}).put(function(req, res){
    // // Update user infomation (PUT)
    // userService.updatePassword(function(result){
    //     console.log(result);
    //     res.send(result);
    // },req)
});


module.exports = router;
