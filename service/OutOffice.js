// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('OutOffice');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');
var OutOfficeDao= require('../dao/outOfficeDao.js');
var ApprovalDao= require('../dao/approvalDao.js');
var CommuteDao = require('../dao/commuteDao.js');

var OutOffice = function (data) {
    var _getOutOfficeList = function (data) {
        return OutOfficeDao.selectOutOfficeList(data);
    }
    var _remove = function (data) {
        return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
			    var promiseArr = [];
			    promiseArr.push(OutOfficeDao.removeOutOffice(connection, data));
                promiseArr.push(ApprovalDao.updateApprovalConfirm(connection, data.approval));
                
                if(!(_.isUndefined(data.commute) || _.isNull(data.commute))){
		            promiseArr.push(CommuteDao.updateCommute_t(connection, data.commute));    
			    }
			    
				Promise.all(promiseArr).then(function(resultArr){
					connection.commit(function(){
						connection.release();
						resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					});
				}).catch(function(){
				    connection.rollback(function(){
				        connection.release();
				        reject();
				    });
				});	
			});
		});
    }
    return {
        getOutOfficeList:_getOutOfficeList,
        remove : _remove
    }
}

module.exports = new OutOffice();

