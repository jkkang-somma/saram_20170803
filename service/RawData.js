
var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
var RawDataDao= require("../dao/rawDataDao.js");

var RawData = function (data) {
    var _data=_.initial([]);
    var schema=new Schemas('rawData');
    _data = schema.get(data);
    
    var _get = function (fieldName) {
        if (_.isNull(fieldName) || _.isUndefined(fieldName)) return _.noop();
        if (_.has(_data, fieldName)){
            return _data[fieldName];
        } else {
            return _.noop;
        }
    }
    var _selectRawDataList = function(start, end){
        var startDate = new Date(start);
        var endDate = new Date(end);
        
        return RawDataDao.selectRawDataList(startDate.getTime(), endDate.getTime());
    }
    var _insertRawData = function () {
        return RawDataDao.insertRawData(_data);
    }
    
    return {
        get:_get,
        data:_data,
        insertRawData:_insertRawData,
        selectRawDataList:_selectRawDataList
    }
}

module.exports = RawData;

