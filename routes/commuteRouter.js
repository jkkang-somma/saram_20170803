var express = require('express');
var _ = require('underscore');
var debug = require('debug')('commuteRouter');
var router = express.Router();
var Commute = require('../service/Commute.js');
var sessionManager = require('../lib/sessionManager');
var Schemas = require('../schemas');

router.route('/')
.get(function(req, res){
	if(_.isUndefined(req.query.date)){
		if(!_.isUndefined(req.query.id)){
			Commute.getCommuteByID(req.query).then(function(result){
				res.send(result);
			});
		}else{
			Commute.getCommute(req.query).then(function(result) {
				try{
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
});

router.route('/bulk')
.post(function(req, res){
	var data = req.body.data;

	var filterData = _.filter(data, function(d){
		var workType = d.work_type;
		if(workType.match("^1")){
			return workType;
		}
	});

	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == Schemas().ADMIN) {	// admin 일 경우만 생성
	    Commute.insertCommute(data).then(function(result){
			debug("Send Email : " + filterData.length);
			if(!_.isUndefined(filterData)&&filterData.length > 0){
				Commute.sendLateForWorkEmail(filterData).then(function(){
					debug("Send Email");
				}).catch(function(e){
					debug("Fail to Send Email");
				});
			}
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
	if (session.user.admin == Schemas().ADMIN) {	// admin 일 경우만 생성
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
	});
});

router.route('/today')
.get(function(req, res){
	if (!_.isUndefined(req.query.startDate)) {
		Commute.getCommuteToday(req.query).then(function(result){
			res.send(result);
		});
	}else{
		debug('Error CommuteTdoay : date is undefined');
		res.status(500);
    	res.send({
            success:false,
            message: "Internal Error ( date is undefined )",
        });
	}
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
