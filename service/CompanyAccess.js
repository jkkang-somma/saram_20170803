// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Vacation');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var RawDataDao= require('../dao/rawDataDao.js');

var CompanyAccess = function() {	

	var _setAccess = function(data, user) {
		
		var need_confirm = 1; // 1: 정상 , 2: 확인 필요
		
		var hasIp = false;
		if (user.ip_pc == data.ip_pc || user.ip_office == data.ip_office) {
//		if (user.ip_office == data.ip_office) {
			hasIp = true;
		}
				
		need_confirm = (hasIp)? 1 : 2;
		
		var insertData = {
				id : user.id,
				name : user.name,
				department : user.dept_name,
				type : data.type,
				ip_pc : data.ip_pc,
				ip_office : data.ip_office,
				need_confirm : need_confirm
		};
		
		return RawDataDao.insertRawDataCompanyAccess(insertData);
	}
	
	return {
		setAccess : _setAccess
	}
} 

module.exports = new CompanyAccess();