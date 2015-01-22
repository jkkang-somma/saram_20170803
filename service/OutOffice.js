// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('OutOffice');
var Schemas = require("../schemas.js");
var OutOfficeDao= require('../dao/outOfficeDao.js');

var OutOffice = function (data) {
    var _data=_.initial([]);
    var schema=new Schemas('outoffice');
    _data = schema.get(data);
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    }
    var _getOutOfficeList = function (start, end) {
        return OutOfficeDao.selectOutOfficeList(start, end);
    }
    var _addOutOffice = function () {
        return OutOfficeDao.insertOutOffice(_data);
    }
    var _remove = function (doc_num) {
        return OutOfficeDao.removeOutOffice(doc_num);
    }
    return {
        get:_get,
        getOutOfficeList:_getOutOfficeList,
        addOutOffice:_addOutOffice,
        remove : _remove
    }
}

module.exports = OutOffice;

