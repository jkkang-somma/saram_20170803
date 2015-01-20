var debug = require('debug')('rawDataDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var RawDataDao = function () {
}

RawDataDao.prototype.insertRawData =  function (data) {
    var queryStr = db.getQuery('rawData', 'insertRawData');
    return db.queryV2(queryStr, [data.id, data.name, data.department, data.date + " " + data.time, data.year, data.type]);
}

RawDataDao.prototype.selectRawDataList =  function (data) {
    var queryStr = db.getQuery('rawData', 'selectRawDataList');
    return db.queryV2(queryStr, [data.start, data.end]);
}


module.exports = new RawDataDao();
