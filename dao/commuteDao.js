var debug = require('debug')('CommuteDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CommuteDao = function () {
}

// 근태자료관리 조회 
CommuteDao.prototype.selectCommute =  function (data) {
	var queryStr = db.getQuery('commute', 'selectCommute');
    debug(queryStr);
    return db.queryV2(queryStr, [data.startDate, data.endDate]);
}

// 툴퇴근 수정 
CommuteDao.prototype.updateCommuteResultInOutTime =  function (data) {
	var queryStr = db.getQuery('commute', 'updateCommuteResultInOutTime');
    debug(queryStr);
    return db.queryV2(queryStr, [data.in_time, data.in_time_change, data.out_time, data.out_time_change, data.id, data.year, data.date]);
}

CommuteDao.prototype.insertCommute =  function (data) {
	var queryStr = db.getQuery('commute', 'insetCommuteResult');
    debug(queryStr);
    return db.queryV2(
        queryStr, 
        [
            data.date, data.department, data.id, data.in_time, data.late_time, data.name, data.out_office_code,
            data.out_time, data.over_time, data.overtime_code, data.vacation_code, data.date+" "+data.standard_in_time,
            data.date+" "+data.standard_out_time, data.work_type, data.year,
            data.department, data.in_time, data.late_time, data.name, data.out_office_code,
            data.out_time, data.over_time, data.overtime_code, data.vacation_code, data.date+" "+data.standard_in_time,
            data.date+" "+data.standard_out_time, data.work_type
        ]);
}

CommuteDao.prototype.selectCommuteDate = function(date) {
	var queryStr = db.getQuery('commute', 'selectCommuteDate');
    debug(queryStr);
    debug(date);
    return db.queryV2(queryStr, [date]);
}

// comment 갯수 수정 
CommuteDao.prototype.updateCommuteCommentCount =  function (data) {
	var queryStr = db.getQuery('commute', 'updateCommuteCommentCount');
    debug(queryStr);
    return db.queryV2(queryStr, [data.id, data.year, data.date, data.id, data.year, data.date]);
}

module.exports = new CommuteDao();