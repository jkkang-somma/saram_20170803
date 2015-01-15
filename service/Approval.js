// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var ApprovalDao= require('../dao/approvalDao.js');

var Approval = function (data) {
    var _data=_.initial([]);
    var schema=new Schemas('approval');
    _data = schema.get(data);
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    }
    var _getApprovalList = function () {
        return ApprovalDao.selectApprovalList();
    }
    var _getApprovalListWhere = function (startDate, endDate) {
        return ApprovalDao.selectApprovalListWhere(startDate, endDate);
    }
    var _insertApproval = function () {
        return ApprovalDao.insertApproval(_data);
    }
    var _updateApprovalConfirm = function() {
        return ApprovalDao.updateApprovalConfirm(_data);
    }
    var _getApprovalIndex = function (yearmonth) {
        return ApprovalDao.selectApprovalIndex(yearmonth);
    }
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
    }
    var _updateApprovalIndex = function (yearmonth) {
        return ApprovalDao.updateMaxIndex(yearmonth);
    }
    return {
        get:_get,
        getApprovalList:_getApprovalList,
        getApprovalListWhere:_getApprovalListWhere,
        insertApproval:_insertApproval,
        updateApprovalConfirm:_updateApprovalConfirm,
        getApprovalIndex:_getApprovalIndex,
        setApprovalIndex:_setApprovalIndex,
        updateApprovalIndex:_updateApprovalIndex
    }
}

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Approval;

