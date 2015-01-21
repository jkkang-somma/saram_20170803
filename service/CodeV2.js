var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
 var CodeV2Dao= require('../dao/codeV2Dao.js');

var CodeV2 = function() {	

	var _getDepartmentCode = function() {
		return CodeV2Dao.getDepartmentCode();
	};
	
	var _getOfficeCode = function() {
		return CodeV2Dao.getOfficeCode();
	};
	
	var _getOvertimeCode = function() {
		return CodeV2Dao.getOvertimeCode();
	};
	
	var _getWorktypeCode = function() {
		return CodeV2Dao.getWorktypeCode();
	};

	return {
		getDepartmentCode : _getDepartmentCode,
		getOfficeCode : _getOfficeCode,
		getOvertimeCode : _getOvertimeCode,
		getWorktypeCode : _getWorktypeCode
	}
} 


//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = new CodeV2();

