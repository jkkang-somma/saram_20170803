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
})
router.route('/:_id')
.delete(function(req, res){
    var _id=req.param("_id");
    var inOffice = InOffice({doc_num:_id});
    // var user = new User({id:_id});
    inOffice.remove(_id).then(function(){
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
});;

module.exports = router;
