var debug = require('debug')('holidayDao');
var db = require('../lib/dbmanager.js');

var HolidayDao = function () {
}
HolidayDao.prototype.selectHolidayList =  function (year) {//select user;
    var queryStr = db.getQuery('holiday', 'selectHolidayList');
    return db.queryV2(queryStr, [year]);
}

HolidayDao.prototype.insertHoliday = function(data){
    var queryStr =db.getQuery('holiday', 'insertHoliday');
    return db.queryV2(queryStr, [data.year, data.date, data.memo, data.memo]);
}

HolidayDao.prototype.deleteHoliday = function(data){
    var queryStr =db.getQuery('holiday', 'deleteHoliday');
    return db.queryV2(queryStr, [data.date]);
}


module.exports = new HolidayDao();

