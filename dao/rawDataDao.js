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
    console.log(data.char_date);
    return db.queryV2(queryStr, [data.char_date, data.id, data.name, data.department, data.char_date, data.type, data.ip_pc, data.ip_office, data.need_confirm, data.mac]);
}

RawDataDao.prototype.selectRawDataList =  function (data) {
    if(data.dept == "전체")
        return db.queryV2(db.getQuery('rawData', 'selectRawDataListAll'), [data.start, data.end]);
    else
        return db.queryV2(db.getQuery('rawData', 'selectRawDataList'), [data.start, data.end, data.dept]);
    
}

RawDataDao.prototype.selectRawDataListV2 =  function (data) {
    var queryStr = db.getQuery('rawData', 'selectRawDataListV2');
    return db.queryV2(queryStr, [data.start]);
}

module.exports = new RawDataDao();