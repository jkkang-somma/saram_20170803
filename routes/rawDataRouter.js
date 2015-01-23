var express = require('express');
var debug = require('debug')('rawDataRouter');
var Promise = require('bluebird');
var router = express.Router();
var RawData = require("../service/RawData.js")

router.route('/bulk')
.post(function(req, res){
    var count = 0;    
    var resultArr = [];
    for(var key in req.body){
        resultArr.push(RawData.insertRawData(req.body[key]));
        count++;
    }
    
    Promise.all(resultArr).then(function(){
        debug("Add RawData Count : " + count);
        res.send({msg : "Add RawData Count : " + count, count: count});    
    });
    
    
});


router.route("/")
.get(function(req, res){
    debug(req.query);
    RawData.selectRawDataList(req.query).then(function(result){
        res.send(result);
    });
});


module.exports = router;
