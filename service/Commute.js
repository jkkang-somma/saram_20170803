// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Commute');
var Schemas = require("../schemas.js");
var CommuteDao = require('../dao/commuteDao.js');
var ChangeHistoryDao = require('../dao/changeHistoryDao.js');

var Commute = function() {	

	var _getCommute = function(data, callback) {
		CommuteDao.selectCommute(data).then(function(result) {
			return callback(result);
		});
	};
	
	var _updateCommute = function(inData, callback) {
		// in, out time 변경 횟수 조회 
		ChangeHistoryDao.selectInOutChangeCount(inData).then(function(result) {
			var inTimeChangeCount = result[0].in_time_change_count;
			var outTimeChangeCount = result[0].out_time_change_count;			
			var inTimeChangeData = null;
			var outTimeChangeData = null;
			
			for (var i = 0, len = inData.changeHistoryJSONArr.length; i < len; i++) {
				if (inData.changeHistoryJSONArr[i].change_column == "in_time") {
					inTimeChangeData = inData.changeHistoryJSONArr[i];
					
					// in_time 변경시 1 증가
					inTimeChangeCount++;
				} else {
					outTimeChangeData = inData.changeHistoryJSONArr[i];
					
					// out_time 변경시 1 증가
					outTimeChangeCount++;
				}
			}
			
			// commuteResult 테이블 업데이트 
			inData.in_time_change = inTimeChangeCount;
			inData.out_time_change = outTimeChangeCount;
			CommuteDao.updateCommuteResultInOutTime(inData).then(function(result) {

				if (inTimeChangeData && outTimeChangeData == null) {	// in_time 변경 이력 등록
					ChangeHistoryDao.inserChangeHistory(inTimeChangeData).then(function(result) {
						return callback(result);	
					});					
				} else if (inTimeChangeData == null && outTimeChangeData) {		// out_time 변경 이력 등록
					ChangeHistoryDao.inserChangeHistory(outTimeChangeData).then(function(result) {
						return callback(result);	
					});
				} else {	// in, out 변경 이력 등록
					ChangeHistoryDao.inserChangeHistory(inTimeChangeData).then(function(result) {
						ChangeHistoryDao.inserChangeHistory(outTimeChangeData).then(function(result) {
							return callback(result);	
						});
					});
				}
			});
		});
	}
	
	var _insertCommute = function(data){
		return CommuteDao.insertCommute(data);
	}
	
	var _getCommuteDate = function(date){
		return CommuteDao.selectCommuteDate(date);
	}
	
	var _getCommuteByID = function(data){
		return CommuteDao.selectCommuteByID(data)
	}
	
	var _getLastiestDate = function(){
		return CommuteDao.getLastiestDate();
	}
	
	return {
		getCommute : _getCommute,
		updateCommute : _updateCommute,
		insertCommute : _insertCommute,
		getCommuteDate : _getCommuteDate,
		getCommuteByID: _getCommuteByID,
		getLastiestDate : _getLastiestDate
	}
} 

module.exports = new Commute();
