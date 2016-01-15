// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var Promise = require('bluebird');
var CommuteDao = require('../dao/commuteDao.js');
var ChangeHistoryDao = require('../dao/changeHistoryDao.js');
var db = require('../lib/dbmanager.js');

var Commute = function() {	
	var _getCommute = function(data) {
		return CommuteDao.selectCommute(data);
			
	};
	var _insertCommute = function(data){
		return new Promise(function(resolve, reject){
			var queryArr = [];
			for(var idx in data){
				queryArr.push(CommuteDao.insertCommute(data[idx]));	
			}
			
			db.queryTransaction(queryArr).then(function(resultArr){
				resolve(resultArr);
			}, function(err){
				reject(err);
			});
		});
	};
	
	var _updateCommute = function(data){
		return new Promise(function(resolve, reject){
			var queryArr = [];
			for(var idx in data.data){
				queryArr.push(CommuteDao.updateCommute_t(data.data[idx]));
			}
			for(var idx in data.changeHistory){
				queryArr.push(ChangeHistoryDao.inserChangeHistory(data.changeHistory[idx]));	
			}
			console.log(queryArr);
			db.queryTransaction(queryArr).then(function(resultArr){
				resolve(resultArr);	
			},function(err){
				reject(err);
			});
		});
	};
	
	var _getCommuteDate = function(date){
		return CommuteDao.selectCommuteDate(date);
	};
	
	var _getCommuteByID = function(data){
		return CommuteDao.selectCommuteByID(data);
	};
	
	var _getLastiestDate = function(){
		return CommuteDao.getLastiestDate();
	};
	
	return {
		getCommute : _getCommute,
		updateCommute : _updateCommute,
		insertCommute : _insertCommute,
		getCommuteDate : _getCommuteDate,
		getCommuteByID: _getCommuteByID,
		getLastiestDate : _getLastiestDate
	};
};

module.exports = new Commute();
