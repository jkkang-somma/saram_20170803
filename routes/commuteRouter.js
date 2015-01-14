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
})

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
