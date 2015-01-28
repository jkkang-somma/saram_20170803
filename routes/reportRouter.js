var express = require('express');
var debug = require('debug')('vacationRouter');
var router = express.Router();
var Report = require('../service/Report.js');
var fs = require('fs');
var path = require('path');
var	tempPath = path.normalize(__dirname + '/../temp/');

router.route('/commuteYearReport')
.get(function(req, res, next){
		
	var fileDir = "./excel/files/";
			
	Report.getCommuteYearReport(req.query).then(function(fileName) {
		var filePullPath = fileDir + fileName;
		res.download(filePullPath, function(err) {
			if (err) {
				console.log("excel download fail");
				next(err);
			} else {				
				fs.unlink(filePullPath, function (err) {
				  if (err)  throw next(err);
				  
				  console.log('successfully deleted ' + fileName);
				});
				
			}
		});
	}).catch(function(err) {
		next(err);
	});
	
});

module.exports = router;