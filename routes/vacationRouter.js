var express = require('express');
var debug = require('debug')('vacationRouter');
var router = express.Router();
var Vacation = require('../service/Vacation.js');
//var vacation = new Vacation();

router.route('/')
.get(function(req, res){	
	Vacation.getVacation(req.query, function(result) {
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

router.route('/:id')
.get(function(req, res){	
	console.log("get /:id");
}).post(function(req, res){

	console.log("post /:id");
}).put(function(req, res) {
	console.log("put /:id");
	
	var data = {};
	if (req.body.data === undefined) {
		data = req.body;
	} else {
		data = req.body.data;
	}
	
	Vacation.updateVacation(data, function(result) {
		return res.send(result);
	});	
});


router.route('/:createVacations')
.get(function(req, res){
	
	console.log(req);
//	
//    // Get user infomation list (GET)
//    var result = User.getUserList();
//    debug(result);
    res.send(result);    
    
}).post(function(req, res){
	console.log(req.body);
    // // Insert user infomation (PUT)
    // debug(req.body);
    // userService.insertUser(function(result){
    //     res.send(result);
    // }, req);
    
});


module.exports = router;
