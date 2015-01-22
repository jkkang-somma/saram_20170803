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
		
		var need_confirm = 0; // 1: 정상 , 2: 확인 필요
		
		var hasIp = false;
		if (user.ip_addr_1 == data.ip_address || user.ip_addr_2 == data.ip_address) {
			hasIp = true;
		}
		
		var hasMac = false;
		if (user.mac_addr_1 == data.mac_address || user.mac_addr_2 == data.mac_address) {
			hasMac = true;
		}
		
		need_confirm = (hasIp && hasMac)? 1 : 2;
		
		var insertData = {
				id : user.id,
				name : user.name,
				department : user.dept_name,
				type : data.type,
				ip_address : data.ip_address,
				mac_address : data.mac_address,
				need_confirm : need_confirm
		};
		
		return RawDataDao.insertRawDataCompanyAccess(insertData);
	}
	
	return {
		setAccess : _setAccess
	}
} 

module.exports = new CompanyAccess();