// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('Approval');
var Schemas = require("../schemas.js");
var OfficeCodeDao= require('../dao/officeCodeDao.js');

var Approval = function (data) {
    var _data=_.initial([]);
    var schema=new Schemas('office_code');
    _data = schema.get(data);
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    }
    var _getOfficeCodeList = function () {
        return OfficeCodeDao.selectOfficeCodeList();
    }
    return {
        get:_get,
        getOfficeCodeList:_getOfficeCodeList
    }
}

//new app 은 싱글톤 아니고 app은 계속 생성
module.exports = Approval;

