var express = require('express');
var debug = require('debug')('commuteRouter');
var router = express.Router();
var Commute = require('../service/Commute.js');
//var vacation = new Vacation();

router.route('/')
.get(function(req, res){	
	Commute.getCommute(req.query, function(result) {
		return res.send(result);
	});
}).post(function(req, res){
	var data = {};
	if (req.body.data === undefined) {
		data = req.body;
	} else {
		data = req.body.data;
	}
	
	Vacation.setVacation(data, function(result) {
		return res.send(result);
	});
});



module.exports = router;
