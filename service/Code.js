// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// 코드 Service
var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
var CodeDao= require('../dao/codeDao.js');

var Code = function (data) {
    var category = data.category;
    var _data=_.initial([]);
    var schema=new Schemas('code');
    _data = schema.get(data);
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    }
    var _getCodeList = function(){
        switch (category) {
            case 'dept' :
                return _getDeptList();
            case 'approvalUser' :
                return _getApprovalUserList();      
        }
    }
    var _getDeptList = function(){
        return CodeDao.selectDeptList();
    }
    var _getApprovalUserList = function(){
        return CodeDao.selectApprovalUserList();
    }
    return {
        getCodeList:_getCodeList
    }
}

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Code;

