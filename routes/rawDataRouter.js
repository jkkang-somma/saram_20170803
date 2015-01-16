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
        var rawData = RawData(req.body[key]);
        resultArr.push(rawData.insertRawData());
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
    var rawData = RawData();
        rawData.selectRawDataList(req.query).then(function(result){
        res.send(result);
    });
});


module.exports = router;
