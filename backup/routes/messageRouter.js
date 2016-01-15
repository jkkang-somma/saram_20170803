var express = require('express');
var _ = require('underscore');
var Promise = require('bluebird');
var debug = require('debug')('messageRouter');
var Message =   require('../service/Message.js');
var router = express.Router();

router.route('/')
.get(function(req, res){
    Message.getMessage().then(function(result){
        res.send(result[0]);
    });
}).post(function(req, res){
    Message.setMessage(req.body).then(function(result){
        res.send({result: result, success : true});
    });
});
module.exports = router;
