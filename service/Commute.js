// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Commute');
var Schemas = require("../schemas.js");
var CommuteDao = require('../dao/CommuteDao.js');

var Vacation = function() {	

	var _getCommute = function(data, callback) {
		CommuteDao.selectCommute(data).then(function(result) {
			return callback(result);
		});
	};

	var _setVacation = function(data, callback) {
		CommuteDao.selectUserList().then(function(result) {			
			var obj = {};
			for (var i = 0, len = result.length; i < len; i++) {
				obj = {
						id : result[i].id,
						year : data.year,
						total_day : getHoliday(result[i].join_company)
				}
				CommuteDao.insertVacation(obj);
			}
			callback("success");
		});
	};
	
	var _updateVacation = function(data, callback) {
		CommuteDao.updateVacation(data).then(function(result) {
			debug("CommuteDao.updateVacation 결과");
			debug(result);
			return callback(result);	
		});
	}
	
	return {
		getCommute : _getCommute,
		setVacation : _setVacation,
		updateVacation : _updateVacation
	}
} 

module.exports = new Vacation();