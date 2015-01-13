// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
var express = require('express');
var debug = require('debug')('approvalRouter');
var router = express.Router();
var _ = require("underscore"); 
var Approval = require('../service/Approval.js');


//사용자 목록 조회.
router.route('/list')
.get(function(req, res){
    // Get user infomation list (GET)
    debug(req.query);
    var approval = new Approval();
    var result;
    if(req.query.startDate == '' || req.query.endDate == ''){
        result = approval.getApprovalList().then(function(result){
            debug("Complete Select Approval List.");
            res.send(result);    
        }).catch(function(e){
            debug("Error Select Approval List.");
            res.status(500);
            res.send({
                success:false,
                message: e.message,
                error:e
            });
        });
    }else{
        result = approval.getApprovalListWhere(req.query.startDate, req.query.endDate).then(function(result){
            debug("Complete Select Approval List Where.");
            res.send(result);    
        }).catch(function(e){
            debug("Error Select Approval List Where.");
            res.status(500);
            res.send({
                success:false,
                message: e.message,
                error:e
            });
        });
    }
    
});


module.exports = router;
