var db = require('../lib/dbmanager.js');
var group = "holiday";

var HolidayDao = function () {
};

HolidayDao.prototype.selectHolidayList =  function (year) {//select user;
    return db.query(group, "selectHolidayList", [year]);
};

HolidayDao.prototype.selectHolidayListByPeriod =  function (startDate, endDate) {//select user;
  return db.query(group, "selectHolidayListByPeriod", [startDate, endDate]);
};

HolidayDao.prototype.insertHoliday = function(data){
    return db.query(group, "insertHoliday", [data.year, data.date, data.memo, data.memo]);
};

HolidayDao.prototype.deleteHoliday = function(data){
    return db.query(group, "deleteHoliday", [data.date]);
};

module.exports = new HolidayDao();

