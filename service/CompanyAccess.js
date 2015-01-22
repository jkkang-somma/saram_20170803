// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var RawDataDao= require('../dao/rawDataDao.js');


var CompanyAccess = function() {	

	var _setAccess = function(data, callback) {
		console.log(data);
		
		// 툴근 / 퇴근 이 등록됐는지 확인 
		
		
	}
	
	return {
		setAccess : _setAccess
	}
} 

module.exports = new CompanyAccess();