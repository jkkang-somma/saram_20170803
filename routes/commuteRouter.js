var express = require('express');
var _ = require('underscore');
var debug = require('debug')('commuteRouter');
var router = express.Router();
var Commute = require('../service/Commute.js');
var Promise = require('bluebird');
var sessionManager = require('../lib/sessionManager');

router.route('/')
.get(function(req, res){
	debug(req.query);
	if(_.isUndefined(req.query.date)){
		if(!_.isUndefined(req.query.id)){
			Commute.getCommuteByID(req.query).then(function(result){
				return res.send(result);
			});
		}else{
			Commute.getCommute(req.query, function(result) {
				return res.send(result);
			});
		}
	}else{
		Commute.getCommuteDate(req.query.date).then(function(result){
			return res.send(result);	
		});
	}
})

router.route('/bulk')
.post(function(req, res){
	var count = 0;
	var data = req.body;
	var resultArr = [];
	
	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {	// admin 일 경우만 생성
		for(var key in data){
			// debug(data[key].date +","+data[key].name+","+data[key].work_type);
	        resultArr.push(Commute.insertCommute(data[key]));
	        count++;
	    }
	    Promise.all(resultArr).then(function(){
	    	debug("Add CommuteResult Count : " + count);
	    	res.send({msg : "Add CommuteResult Count : " + count, count: count});		
	    });		
	} else {
		return res.send({error: "관리자 등급만 생성이 가능합니다."});
	}
	

});


router.route('/:id')
.get(function(req, res){	
	console.log(111);
}).post(function(req, res){

}).put(function(req, res){
	console.log(req.body);
	Commute.updateCommute(req.body, function(result) {
		return res.send(result);
	});
});


module.exports = router;
