var express = require('express');
var debug = require('debug')('vacationRouter');
var router = express.Router();
var Vacation = require('../service/Vacation.js');
var sessionManager = require('../lib/sessionManager');

router.route('/')
.get(function(req, res){	
	Vacation.getVacation(req.query, function(result) {
		return res.send(result);
	});

}).post(function(req, res){

	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {	// admin 일 경우만 생성 
		Vacation.setVacation(req.body, function(result) {
			return res.send(result);
		});
	} else {
		return res.send({error: "관리자 등급만 생성이 가능합니다."});
	}
});

router.route('/:id')
.get(function(req, res){	
	console.log("get /:id");
}).post(function(req, res){

}).put(function(req, res) {
	
	var session = sessionManager.get(req.cookies.saram);
	if (session.user.admin == 1) {
		Vacation.updateVacation(req.body, function(result) {
			return res.send(result);
		});
	} else {
		return res.send({"error": "관리자 등급만 수정이 가능합니다."});
	}
});

module.exports = router;