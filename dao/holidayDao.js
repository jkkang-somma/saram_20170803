var debug = require('debug')('holidayDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var HolidayDao = function () {
}
HolidayDao.prototype.selectIdByYear =  function (year) {//select user;
    var queryStr = util.format(db.getQuery('holiday', 'selectHolidayList'), year);
    return db.query(queryStr);
}

module.exports = new HolidayDao();

