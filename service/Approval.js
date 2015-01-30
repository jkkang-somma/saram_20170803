// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var ApprovalDao= require('../dao/approvalDao.js');
var CommuteDao = require('../dao/commuteDao.js');
var OutOfficeDao= require('../dao/outOfficeDao.js');
var InOfficeDao= require('../dao/inOfficeDao.js');

var Promise = require('bluebird');
var db = require('../lib/dbmanager.js');

var Approval = function (data) {
    var _getApprovalList = function (doc_num) {
        return ApprovalDao.selectApprovalList(doc_num);
    }
    var _getApprovalListWhere = function (startDate, endDate, managerId) {
        if(managerId != undefined && managerId != ""){
            return ApprovalDao.selectApprovalByManager(managerId, startDate, endDate);
        }
        return ApprovalDao.selectApprovalListWhere(startDate, endDate);
    }
    var _insertApproval = function (data) {
        return ApprovalDao.insertApproval(data);
    }
    var _updateApprovalConfirm = function(data) {
        return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
			    var promiseArr = [];
			    promiseArr.push(ApprovalDao.updateApprovalConfirm(connection, data.data));
			    if(!(_.isUndefined(data.outOffice) || _.isNull(data.outOffice))){
			        var outOfficeData = {};
			        for(var key in data.outOffice.arrInsertDate){
			            outOfficeData[key] = _.clone( data.outOffice);
			            outOfficeData[key].date = data.outOffice.arrInsertDate[key];
                        outOfficeData[key].year = outOfficeData[key].date.substr(0,4);
                        outOfficeData[key].black_mark = (data.outOffice.black_mark == undefined)? "" : data.outOffice.black_mark;
			        }
			        promiseArr.push(OutOfficeDao.insertOutOffice(connection, outOfficeData));
			    }
			    if(!(_.isUndefined(data.inOffice) || _.isNull(data.inOffice))){
			        var inOfficeData = {};
			        for(var inKey in data.inOffice.arrInsertDate){
			            inOfficeData[inKey] = _.clone( data.inOffice );
			            inOfficeData[inKey].date = data.inOffice.arrInsertDate[inKey];
                        inOfficeData[inKey].year = inOfficeData[inKey].date.substr(0,4);
                        inOfficeData[inKey].black_mark = (data.inOffice.black_mark == undefined)? "" : data.inOffice.black_mark;
			        }
			        promiseArr.push(InOfficeDao.insertInOffice(connection, inOfficeData));
			    }
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
    };
    var _getApprovalIndex = function (yearmonth) {
        return ApprovalDao.selectApprovalIndex(yearmonth);
    };
    var _setApprovalIndex = function () {
        var _schema = new Schemas('approval_index');
        var _param = _schema.get(data);
        var _result = null;
        if(_param.seq != null){
            _result = ApprovalDao.updateMaxIndex(_param);            
        }else{
            _result = ApprovalDao.insertApprovalIndex(_param);
        }
        
        return _result;
    };
    var _updateApprovalIndex = function (yearmonth) {
        return ApprovalDao.updateMaxIndex(yearmonth);
    };
    return {
        getApprovalList:_getApprovalList,
        getApprovalListWhere:_getApprovalListWhere,
        insertApproval:_insertApproval,
        updateApprovalConfirm:_updateApprovalConfirm,
        getApprovalIndex:_getApprovalIndex,
        setApprovalIndex:_setApprovalIndex,
        updateApprovalIndex:_updateApprovalIndex
    };
};

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Approval;

