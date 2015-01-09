var debug = require('debug')('holidayDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var HolidayDao = function () {
}
HolidayDao.prototype.selectHolidayList =  function (year) {//select user;
    var queryStr = util.format(db.getQuery('holiday', 'selectHolidayList'), year);
    return db.query(queryStr);
}

HolidayDao.prototype.insertHoliday = function(data){
    var queryStr = util.format(db.getQuery('holiday', 'insertHoliday'), data.year, data.date, data.memo );
    return db.query(queryStr);
}

module.exports = new HolidayDao();

