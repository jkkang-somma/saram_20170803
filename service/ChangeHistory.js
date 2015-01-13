// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('ChangeHistory');
var Schemas = require("../schemas.js");
var ChangeHistoryDao = require('../dao/ChangeHistoryDao.js');

var ChangeHistory = function() {	

	var _getChangeHistory = function(data, callback) {
		ChangeHistoryDao.selectChangeHistory(data).then(function(result) {
			return callback(result);
		});
	};

	return {
		getChangeHistory : _getChangeHistory
	}
} 

module.exports = new ChangeHistory();