// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');
var OutOfficeDao= require('../dao/outOfficeDao.js');
var ApprovalDao= require('../dao/approvalDao.js');
var CommuteDao = require('../dao/commuteDao.js');

var OutOffice = function (data) {
    var _getOutOfficeList = function (date) {
        return OutOfficeDao.selectOutOfficeList(date);
    };
    var _remove = function (data) {
        return new Promise(function(resolve, reject){
		    var queryArr = [];
		    queryArr.push(OutOfficeDao.removeOutOffice({_id : data._id}));
		    for(var idx in data.approval){
		        queryArr.push(ApprovalDao.updateApprovalConfirm(data.approval[idx]));    
		    }
            if(!(_.isUndefined(data.commute) || _.isNull(data.commute))){
            	for(var idx in data.commute){
	            	queryArr.push(CommuteDao.updateCommute_t(data.commute[idx]));    
            	}
		    }
		    db.queryTransaction(queryArr).then(function(resultArr){
		    	resolve(resultArr);
		    }, function(err){
		    	reject(err);
		    });
		});
    };
    return {
        getOutOfficeList:_getOutOfficeList,
        remove : _remove
    };
};

module.exports = new OutOffice();

