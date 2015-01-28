// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var ReportDao= require('../dao/ReportDao.js');
var UserDao= require('../dao/userDao.js');


var Report = function() {	

	var _getCommuteYearReport = function(data) {
		//return VacationDao.selectVacationsByYear(data.year);
	};
	return {
		getCommuteYearReport : _getCommuteYearReport
	}
} 

module.exports = new Report();