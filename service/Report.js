// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Report');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var ReportDao= require('../dao/ReportDao.js');
var commuteYearExcelCreater = require('../excel/CommuteYearExcelCreater.js');
var commuteYearExcelCreater25 = require('../excel/CommuteYearExcelCreater25.js');
var commuteResultExcelCreater = require('../excel/CommuteResultExcelCreater.js');


var Report = function() {	

	var _getCommuteYearReport = function(selObj) {		
	    return new Promise(function(resolve, reject){// promise patten

			var queryResults = [];
			
			// 레포트 사용자 리스트와 각 통계 리스트의 정렬 순서는 동일해야함 
			queryResults.push( ReportDao.selectReportUsers() );
			queryResults.push( ReportDao.selectLateWorkerReport(selObj) );
			queryResults.push( ReportDao.selectUsedHolidayReport(selObj) );
			queryResults.push( ReportDao.selectOverTimeWorkeReport(selObj) );
			queryResults.push( ReportDao.selectOverTimeWorkTypeReport(selObj) );
			queryResults.push( ReportDao.selectOverTimeWorkPayReport(selObj) );
			queryResults.push( ReportDao.selectHolidayWorkTypeReport(selObj) );
			queryResults.push( ReportDao.selectHolidayWorkPayReport(selObj) );
	    	
	    	Promise.all(queryResults).then(function(result){
				commuteYearExcelCreater.createExcel(selObj, result).then(function(excelResult) {
					resolve( excelResult);
				}).catch(function(err) {
		        	reject(err);
		        })
	        }).catch(function(err) {
	        	reject(err);
	        })
	    });
	};
	
	var _getCommuteYearReport25 = function(selObj) {		
	    return new Promise(function(resolve, reject){// promise patten

			var queryResults = [];
			
			// 레포트 사용자 리스트와 각 통계 리스트의 정렬 순서는 동일해야함 
			queryResults.push( ReportDao.selectReportUsers() );
			queryResults.push( ReportDao.selectOverTimeWorkeReport25(selObj) );	// 잔업 시간
			debug("queryResults1: " + queryResults);
			queryResults.push( ReportDao.selectOverTimeWorkTypeReport25(selObj) );	// 잔업 타입
			queryResults.push( ReportDao.selectOverTimeWorkPayReport25(selObj) );	// 잔업 수당
	    	
	    	Promise.all(queryResults).then(function(result){
				commuteYearExcelCreater25.createExcel(selObj, result).then(function(excelResult) {
					resolve( excelResult);
				}).catch(function(err) {
		        	reject(err);
		        })
	        }).catch(function(err) {
	        	reject(err);
	        })
	    });
	};
	
	var _gettCommuteResultTblReport = function(selObj) {		
	    return new Promise(function(resolve, reject){// promise patten

	    	debug("Report service : _gettCommuteResultTblReport");
	    	
			var queryResults = [];
			
			debug("Report service : DB 조회 시작 ");
			// 레포트 사용자 리스트와 각 통계 리스트의 정렬 순서는 동일해야함 
			queryResults.push( ReportDao.selectReportCommuteResultTbl(selObj) );
	    	
	    	Promise.all(queryResults).then(function(result){
	    		
	    		debug("Report service : DB 조회 완료 ");
	    		
	    		commuteResultExcelCreater.createExcel(selObj, result).then(function(excelResult) {
					resolve( excelResult);
				}).catch(function(err) {
		        	reject(err);
		        })
	        }).catch(function(err) {
	        	reject(err);
	        })
	    });
	};
	
	return {
		getCommuteYearReport : _getCommuteYearReport,
		gettCommuteResultTblReport : _gettCommuteResultTblReport,
		getCommuteYearReport25 : _getCommuteYearReport25
	}
} 

module.exports = new Report();