var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");
var RawDataDao= require("../dao/rawDataDao.js");

var RawData = function (data) {
    var _selectRawDataList = function(data){
        return RawDataDao.selectRawDataList(data);
    }
    var _insertRawData = function (data) {
        return RawDataDao.insertRawData(data);
    }
    
    return {
        insertRawData:_insertRawData,
        selectRawDataList:_selectRawDataList
    }
}

module.exports = new RawData();

