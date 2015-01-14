var express = require('express');
var debug = require('debug')('vacationRouter');
var router = express.Router();
var Vacation = require('../service/Vacation.js');

router.route('/')
.get(function(req, res){	
	Vacation.getVacation(req.query, function(result) {
		return res.send(result);
	});

}).post(function(req, res){
	Vacation.setVacation(req.body, function(result) {
		return res.send({});
	});
});

router.route('/:id')
.get(function(req, res){	
	console.log("get /:id");
}).post(function(req, res){

}).put(function(req, res) {
	Vacation.updateVacation(req.body, function(result) {
		return res.send(result);
	});	
});

module.exports = router;