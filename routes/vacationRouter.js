var express = require('express');
var debug = require('debug')('vacationRouter');
var router = express.Router();
var Vacation = require('../service/Vacation.js');


router.route('/')
.get(function(req, res){
	
//	var result =  [{"year":"2015","id":0,"department":"부서0","name":"name0","total_day":0,"year_holiday":0,"total_holiday_work_day":0,"used_holiday":0,"holiday":0},{"year":"2015","id":2,"department":"부서2","name":"name2","total_day":2,"year_holiday":2,"total_holiday_work_day":2,"used_holiday":0,"holiday":0},{"year":"2015","id":4,"department":"부서4","name":"name4","total_day":4,"year_holiday":4,"total_holiday_work_day":4,"used_holiday":0,"holiday":0},{"year":"2015","id":6,"department":"부서6","name":"name6","total_day":6,"year_holiday":6,"total_holiday_work_day":6,"used_holiday":0,"holiday":0},{"year":"2015","id":8,"department":"부서8","name":"name8","total_day":8,"year_holiday":8,"total_holiday_work_day":8,"used_holiday":0,"holiday":0},{"year":"2015","id":10,"department":"부서10","name":"name10","total_day":10,"year_holiday":10,"total_holiday_work_day":10,"used_holiday":0,"holiday":0}];
	
	var vacation = new Vacation(req.query);
	
	var result = vacation.getVacation().then(function(result) {
		console.log("결과 ");
		console.log(result);
		
	    res.send(result);		
	});
    
    
}).post(function(req, res){
    // // Insert user infomation (PUT)
    // debug(req.body);
    // userService.insertUser(function(result){
    //     res.send(result);
    // }, req);
    
});

router.route('/:year')
.get(function(req, res){
	
	console.log(req.param.year);
//	
//    // Get user infomation list (GET)
//    var result = User.getUserList();
//    debug(result);
    res.send(result);    
    
}).post(function(req, res){
    // // Insert user infomation (PUT)
    // debug(req.body);
    // userService.insertUser(function(result){
    //     res.send(result);
    // }, req);
    
});


module.exports = router;
