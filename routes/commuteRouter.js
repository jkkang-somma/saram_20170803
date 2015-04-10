var express = require('express');
var _ = require('underscore');
var debug = require('debug')('commuteRouter');
var router = express.Router();
var Commute = require('../service/Commute.js');
var Promise = require('bluebird');
var sessionManager = require('../lib/sessionManager');
router.route('/')
.get(function(req, res){
	if(_.isUndefined(req.query.date)){
		debug("######################");
		debug(process.memoryUsage());
		if(!_.isUndefined(req.query.id)){
			Commute.getCommuteByID(req.query).then(function(result){
				res.send(result);
			});
		}else{
			Commute.getCommute(req.query, function(result) {
				try{
					debug("######################");
					debug(process.memoryUsage());
					res.send(result);
				}catch(err){
					debug(err);
				}
				
			});
		}
	}else{
		Commute.getCommuteDate(req.query.date).then(function(result){
			res.send(result);	
		});
	}
})

router.route('/bulk')
.post(function(req, res){
	var data = req.body.data;
	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {	// admin 일 경우만 생성
	    Commute.insertCommute(data).then(function(result){
	    	res.send({
	            success:true,
	            message: "Add CommuteResult Success! ("+ result +")"
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
}).put(function(req, res){
	var data = req.body;
	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {	// admin 일 경우만 생성
		Commute.updateCommute(data).then(function(){
			res.send({success : true});
		});

	}else{
		res.status(401);
    	res.send({
            success:false,
            message: "관리자 등급만 생성이 가능합니다.",
        });
	}
});

router.route('/lastiestdate')
.get(function(req,res){
	Commute.getLastiestDate().then(function(result){
		res.send(result);
	})
});

router.route('/:id')
.get(function(req, res){
}).post(function(req, res){

}).put(function(req, res){
	Commute.updateChangeHistory(req.body, function(result) {
		return res.send(result);
	});
});

//Dashboard 
router.route('/result/:id')
.get(function(req, res){
	res.send({});
});

module.exports = router;
