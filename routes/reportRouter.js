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
	
	console.log("URL 시작 : /commuteResultTblReport");
	
	var searchValObj = {
			year : req.query.startTime.substring(0, 4),
			startTime : req.query.startTime,
			endTime : req.query.endTime,
			isInLeaveWorker : (req.query.isInLeaveWorker == "true") ? true : false
	};
	
	console.log("Report Router 검색 조건 : " + searchValObj);
			
	Report.gettCommuteResultTblReport(searchValObj).then(function(filePullPath) {

		console.log("엑셀 다운로드 시작  1");
		res.download(filePullPath, function(err) {
			console.log("엑셀 다운로드 시작 2");
			
			if (err) {
				console.log("excel download fail");
				next(err);
			} else {
				console.log("엑셀 다운로드 시작 3");
				
				fs.unlink(filePullPath, function (err) {
					console.log("엑셀 다운로드 성공 파일 삭제 !!");
				  if (err) {  
					  console.log("파일 삭제 실패 ");
					  throw next(err);
				  }
				  
				});
				
			}
		});
	}).catch(function(err) {
		next(err);
	});	
});

module.exports = router;