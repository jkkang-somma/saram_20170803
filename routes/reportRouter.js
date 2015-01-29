var express = require('express');
var debug = require('debug')('reportRouter');
var fs = require('fs');
var router = express.Router();
var Report = require('../service/Report.js');


router.route('/commuteYearReport')
.get(function(req, res, next){
			
	Report.getCommuteYearReport(req.query).then(function(filePullPath) {

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