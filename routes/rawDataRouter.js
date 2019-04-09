var express = require('express');
var debug = require('debug')('rawDataRouter');
var Promise = require('bluebird');
var router = express.Router();
var RawData = require("../service/RawData.js")
var sessionManager = require('../lib/sessionManager');
var Schemas = require('../schemas');

router.route('/bulk')
.post(function(req, res){
    var data = req.body;
    var session = sessionManager.get(req.cookies.saram);
    if (session.user.admin == Schemas().ADMIN) {	// admin 일 경우만 생성
	    RawData.insertRawData(data).then(function(result){
			debug("END DB Query");
	    	res.send({
	    		result: result,
	            success:true,
	        });
	    }, function(errResult){
	    	res.status(500);
        	res.send({
	            success:false,
	            message: errResult.message,
	            error:errResult
	        });
	    });
	} else {
		res.status(401);
    	res.send({
            success:false,
            message: "관리자 등급만 생성이 가능합니다.",
        });
	}
});


router.route("/")
.get(function(req, res){
	var adminString=sessionManager.getAdminString(req.cookies.saram);
    RawData.selectRawDataList(req.query, adminString).then(function(result){
        res.send(result);
    });
});


module.exports = router;
