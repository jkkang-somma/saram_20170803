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
		res.cookie("fileDownload", true);
		res.download(filePullPath, function(err) {
			if (err) {
				debug("excel download fail");
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

router.route('/commuteYearReport25')
.get(function(req, res, next){
	
	var searchValObj = {
			year : req.query.startTime.substring(0, 4),
			startTime : req.query.startTime,
			endTime : req.query.endTime,
			isInLeaveWorker : (req.query.isInLeaveWorker == "true") ? true : false
	};
			
	Report.getCommuteYearReport25(searchValObj).then(function(filePullPath) {
		res.cookie("fileDownload", true);
		res.download(filePullPath, function(err) {
			if (err) {
				debug("excel download fail");
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
	
	debug("URL 시작 : /commuteResultTblReport");
	
	var searchValObj = {
			year : req.query.startTime.substring(0, 4),
			startTime : req.query.startTime,
			endTime : req.query.endTime,
			isInLeaveWorker : (req.query.isInLeaveWorker == "true") ? true : false
	};
	
	debug("Report Router 검색 조건 : " , searchValObj);
			
	Report.gettCommuteResultTblReport(searchValObj).then(function(filePullPath) {

		debug("엑셀 다운로드 시작  1");
		debug(filePullPath);
		res.cookie("fileDownload", true);
		res.download(filePullPath, function(err) {
			debug("엑셀 다운로드 시작 2");
			
			if (err) {
				debug("excel download fail");
				next(err);
			} else {
				debug("엑셀 다운로드 시작 3");
				
				fs.unlink(filePullPath, function (err) {
					debug("엑셀 다운로드 성공 파일 삭제 !!");
				  if (err) {  
					  debug("파일 삭제 실패 ");
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