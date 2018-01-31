var express = require('express');
var _ = require('underscore');
var debug = require('debug')('officeItemHistoryRouer');
var Promise = require('bluebird');
var router = express.Router();
var OfficeItemHistory = require("../service/OfficeItemHistory.js")
var sessionManager = require('../lib/sessionManager');
	
router.route("/history")
.get(function(req, res){
    debug("Select OfficeItemHistory List." + req);
    if(!_.isUndefined(req.query.start)&&!_.isUndefined(req.query.end)){
        OfficeItemHistory.selectOfficeItemHistoryList(req.query).then(function(result){
            debug("Complete OfficeItemHistoryList List.");
            debug("Select selectOfficeItemHistoryList result : " + result);
            res.send(result);
        });
    }
    else if(!_.isUndefined(req.query.serial_yes)){
        debug("Select OfficeItemHistory query.serial_yes.");
        OfficeItemHistory.selectOfficeItemHistoryListV2(req.query).then(function(result){
            debug("Complete OfficeItemHistoryListV2 List.");
            debug("Select selectOfficeItemHistoryListV2 result : " + result);
            res.send(result);
        });
    }
    else{
            debug("Select OfficeItemHistory query empty.");
    }
})
//
//router.route('/history')
.post(function(req, res){    
    //var officeItemHistory = new OfficeItemHistory(req.body);
    debug("officeitem history add:");
    
    OfficeItemHistory.addOfficeItemHistory(req.body).then(function(e){
        debug("Complete Add officeitem_history.");
        res.send({success:true, msg:"Complete Add officeitem_history."});
    }).catch(function(e){
        debug("Error Add officeitem_history.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;
