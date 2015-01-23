// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var debug = require('debug')('InOffice');
var Schemas = require("../schemas.js");
var InOfficeDao= require('../dao/inOfficeDao.js');

var InOffice = function (data) {
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
    var _getInOfficeList = function (start, end) {
        return InOfficeDao.selectInOfficeList(start, end);
    }
    var _addInOffice = function () {
        return InOfficeDao.insertInOffice(_data);
    }
    var _removeInOffice = function (doc_num) {
        return InOfficeDao.removeInOffice(doc_num);
    }
    return {
        get:_get,
        getInOfficeList:_getInOfficeList,
        addInOffice:_addInOffice,
        remove : _removeInOffice
    }
}

module.exports = InOffice;

