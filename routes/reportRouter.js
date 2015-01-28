var express = require('express');
var debug = require('debug')('vacationRouter');
var router = express.Router();
var Report = require('../service/Report.js');
var sessionManager = require('../lib/sessionManager');
var path = require('path');
var	tempPath = path.normalize(__dirname + '/../temp/');

router.route('/commuteYearReport')
.get(function(req, res, next){
	//var tempDir = "../temp/";
	var fileName = "sample.xlsx";
	var fileFullPath = tempPath+fileName;
	console.log(fileFullPath);
	
	res.download(fileFullPath);
			
			
//	Report.getCommuteYearReport(req.query).then(function(result) {
//		return res.send(result);
//	}).catch(function(err) {
//		next(err);
//	});
	
});

module.exports = router;