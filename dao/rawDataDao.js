var debug = require('debug')('rawDataDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var RawDataDao = function () {
}

RawDataDao.prototype.insertRawData =  function (data) {
    var queryStr = util.format(db.getQuery('rawData', 'insertRawData'), data.id, data.name, data.department, data.time, data.type);
    return db.query(queryStr);
}

module.exports = new RawDataDao();
