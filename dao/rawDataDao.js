var debug = require('debug')('rawDataDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var RawDataDao = function () {
}

RawDataDao.prototype.insertRawData =  function (data) {
    var queryStr = db.getQuery('rawData', 'insertRawData');
    return db.queryV2(queryStr, [data.id, data.name, data.department, data.date + " " + data.time, data.year, data.type, data.date + " " + data.time, data.type]);
}

// 툴퇴근 정보 등록 
RawDataDao.prototype.insertRawDataCompanyAccess =  function (data) {
    var queryStr = db.getQuery('rawData', 'insertRawDataCompanyAccess');
    return db.queryV2(queryStr, [data.id, data.name, data.department, data.type, data.ip_address, data.mac_address, data.need_confirm]);
}

RawDataDao.prototype.selectRawDataList =  function (data) {
    var queryStr = db.getQuery('rawData', 'selectRawDataList');
    return db.queryV2(queryStr, [data.start, data.end]);
}

module.exports = new RawDataDao();