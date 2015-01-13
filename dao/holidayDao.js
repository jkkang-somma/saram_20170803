var debug = require('debug')('holidayDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var HolidayDao = function () {
}
HolidayDao.prototype.selectHolidayList =  function (year) {//select user;
    var queryStr = db.getQuery('holiday', 'selectHolidayList');
    return db.queryV2(queryStr, [year]);
}

HolidayDao.prototype.insertHoliday = function(data){
    var queryStr =db.getQuery('holiday', 'insertHoliday');
    return db.queryV2(queryStr, [data.year, data.date, data.memo ]);
}

module.exports = new HolidayDao();

