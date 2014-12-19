var express = require('express');
var fs = require('fs');
var debug = require('debug')('/am');
var router = express.Router();
var defaultConfig = require("../../config/default.json");

router.get('/upload', function(req, res){
    res.send(res.render('am/upload',{config:defaultConfig}));
});

router.post('/upload', function(req, res){
    
});

module.exports = router;