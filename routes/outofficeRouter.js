// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12

var express = require('express');
var debug = require('debug')('OutOfficeRouter');
var Promise = require('bluebird');
var router = express.Router();
var OutOffice = require('../service/OutOffice.js');

router.route('/')
.get(function(req, res) {
    //var start = req.query.start;
    //var end = req.query.end;
    var outOffice = new OutOffice();
    outOffice.getOutOfficeList().then(function(result){
       res.send(result); 
    });
    
}).post(function(req, res){
    // var outOffice = new OutOffice(req.body);
    var count = 0;    
    var resultArr = [];
    var arrInsertDate = req.body.arrInsertDate;
    if(arrInsertDate != undefined){
        for(var i = 0; i < arrInsertDate.length; i++){
            req.body.date = arrInsertDate[i];
            debug(req.body);
            
            var outOffice = OutOffice(req.body);
            resultArr.push(outOffice.addOutOffice());
            count++;
        }
    }
    
    Promise.all(resultArr).then(function(e){
        res.send({success:true, msg:"Complete Add Approval."})
    }).catch(function(e){
        debug("Error Add Approval.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;
