// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var ReportDao= require('../dao/ReportDao.js');
var UserDao= require('../dao/userDao.js');
var commuteYearExcelCreater = require('../excel/CommuteYearExcelCreater.js');


var Report = function() {	

	var _getCommuteYearReport = function(selObj) {
		
	    return new Promise(function(resolve, reject){// promise patten

			var queryResults = [];
			
			queryResults.push( UserDao.selectUserList() );
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
	return {
		getCommuteYearReport : _getCommuteYearReport
	}
} 

module.exports = new Report();