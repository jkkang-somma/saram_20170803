var express = require('express');
var debug = require('debug')('codeRouterV2');
var router = express.Router();
var CodeV2 = require('../service/CodeV2.js');

router.route('/department')
.get(function(req, res) {
    CodeV2.getDepartmentCode().then(function(result){
        res.send(result);
    });
});

router.route('/office')
.get(function(req,res){
    CodeV2.getOfficeCode().then(function(result){
        res.send(result);
    });
});

router.route('/overtime')
.get(function(req,res){
    CodeV2.getOvertimeCode().then(function(result){
        res.send(result);
    });
});

router.route('/worktype')
.get(function(req,res){
    CodeV2.getWorktypeCode().then(function(result){
        res.send(result);
    });
});

module.exports = router;