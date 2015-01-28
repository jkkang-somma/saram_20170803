// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('InOffice');
var Schemas = require("../schemas.js");
var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');
var ApprovalDao= require('../dao/approvalDao.js');
var CommuteDao = require('../dao/commuteDao.js');
var InOfficeDao= require('../dao/inOfficeDao.js');

var InOffice = function (data) {
    var _getInOfficeList = function (data) {
        return InOfficeDao.selectInOfficeList(data);
    }
    var _removeInOffice = function (data) {
         return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
			    var promiseArr = [];
			    promiseArr.push(InOfficeDao.removeInOffice(connection, [{_id : data._id }]));
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
        getInOfficeList:_getInOfficeList,
        remove : _removeInOffice
    }
}

module.exports = new InOffice();

