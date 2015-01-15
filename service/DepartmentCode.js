var _ = require("underscore"); 
var debug = require('debug')('OfficeCode');
var Schemas = require("../schemas.js");
var DepartmentCodeDao= require('../dao/departmentCodeDao.js');

var OfficeCode = function (data) {
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
    var _getDepartmentCodeList = function () {
        return DepartmentCodeDao.selectDepartmentCodeList();
    }
    return {
        get:_get,
        getDepartmentCodeList: _getDepartmentCodeList
    }
}

module.exports = OfficeCode;

