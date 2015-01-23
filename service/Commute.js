// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Commute');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var CommuteDao = require('../dao/commuteDao.js');
var ChangeHistoryDao = require('../dao/changeHistoryDao.js');
var db = require('../lib/dbmanager.js');

var Commute = function() {	

	var _getCommute = function(data, callback) {
		CommuteDao.selectCommute(data).then(function(result) {
			return callback(result);
		});
	};
	
	var _insertCommute = function(data){
		return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
				var inserCommuteResult = CommuteDao.insertCommute(connection, data);	
				Promise.all([inserCommuteResult]).then(function(resultArr){
					connection.commit(function(){
						connection.release();
						resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					})
				});	
			});
		});
	};
	
	var _updateCommute = function(data){
		return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
				var updateCommuteResult = CommuteDao.updateCommute_t(connection, data.data);
				var changeHistoryResult = ChangeHistoryDao.inserChangeHistory(connection, data.changeHistory);	
				Promise.all([updateCommuteResult, changeHistoryResult]).then(function(resultArr){
					connection.commit(function(){
						connection.release();
						resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					})
				});	
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
