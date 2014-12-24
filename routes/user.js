var express = require('express');
var debug = require('debug')('/routes/user');
var router = express.Router();
var service = require('../service/user.js');


router.route('/')
.get(function(req, res){
    // Get user infomation list (GET)
    service.selectUserAll(function(result){
        res.send(result);    
    });
}).post(function(req, res){
    // Insert user infomation (PUT)
    debug(req.body);
    service.insertUser(function(result){
        res.send(result);
    }, req);
    
});


router.route('/:user_id')
.get(function(req, res){
    // Get user infomation (GET)
    service.selectUser(function(result){
        res.send(result);
    }, req.param.name);
    
}).put(function(req, res){
    // Update user infomation (PUT)
    service.updatePassword(function(result){
        console.log(result);
        res.send(result);
    },req)
});

module.exports = router;
