// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12

var express = require('express');
var debug = require('debug')('InOfficeRouter');
var Promise = require('bluebird');
var router = express.Router();
var InOffice = require('../service/InOffice.js');

router.route('/')
.get(function(req, res) {
    //var start = req.query.start;
    //var end = req.query.end;
    var inOffice = new InOffice();
    inOffice.getInOfficeList().then(function(result){
       res.send(result); 
    });
    
}).post(function(req, res){
    var count = 0;    
    var resultArr = [];
    var arrInsertDate = req.body.arrInsertDate;
    if(arrInsertDate != undefined){
        for(var i = 0; i < arrInsertDate.length; i++){
            req.body.date = arrInsertDate[i];
            debug(req.body);
            
            var inOffice = InOffice(req.body);
            resultArr.push(inOffice.addInOffice());
            count++;
        }
    }
    
    Promise.all(resultArr).then(function(e){
        res.send({success:true, msg:"Complete Add InOffice."})
    }).catch(function(e){
        debug("Error Add InOffice.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;
