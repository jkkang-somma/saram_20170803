var express = require('express');
var debug = require('debug')('reportRouter');
var fs = require('fs');
var router = express.Router();
var Report = require('../service/Report.js');


router.route('/commuteYearReport')
.get(function(req, res, next){
	
	var searchValObj = {
			year : req.query.startTime.substring(0, 4),
			startTime : req.query.startTime,
			endTime : req.query.endTime,
			isInLeaveWorker : (req.query.isInLeaveWorker == "true") ? true : false
	};
			
	Report.getCommuteYearReport(searchValObj).then(function(filePullPath) {

		res.download(filePullPath, function(err) {
			if (err) {
				console.log("excel download fail");
				next(err);
			} else {				
				fs.unlink(filePullPath, function (err) {
				  if (err)  throw next(err);
				  
				});
				
			}
		});
	}).catch(function(err) {
		next(err);
	});	
});

router.route('/commuteResultTblReport')
.get(function(req, res, next){
	
	var searchValObj = {
			year : req.query.startTime.substring(0, 4),
			startTime : req.query.startTime,
			endTime : req.query.endTime,
			isInLeaveWorker : (req.query.isInLeaveWorker == "true") ? true : false
	};
			
	Report.gettCommuteResultTblReport(searchValObj).then(function(filePullPath) {

		res.download(filePullPath, function(err) {
			if (err) {
				console.log("excel download fail");
				next(err);
			} else {				
				fs.unlink(filePullPath, function (err) {
				  if (err)  throw next(err);
				  
				});
				
			}
		});
	}).catch(function(err) {
		next(err);
	});	
});

module.exports = router;