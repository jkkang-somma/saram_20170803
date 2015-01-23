var debug = require('debug')('rawDataDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var RawDataDao = function () {
}

RawDataDao.prototype.insertRawData =  function (connection, data) {
    var queryStr = db.getQuery('rawData', 'insertRawData');
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "id", "name", "department", "char_date", "year", "type", "char_date", "type"
        ]
    );
}

// 툴퇴근 정보 등록 
RawDataDao.prototype.insertRawDataCompanyAccess =  function (data) {
    var queryStr = db.getQuery('rawData', 'insertRawDataCompanyAccess');
    return db.queryV2(queryStr, [data.id, data.name, data.department, data.type, data.ip_pc, data.ip_office, data.need_confirm]);
}

RawDataDao.prototype.selectRawDataList =  function (data) {
    var queryStr = db.getQuery('rawData', 'selectRawDataList');
    return db.queryV2(queryStr, [data.start, data.end]);
}

module.exports = new RawDataDao();