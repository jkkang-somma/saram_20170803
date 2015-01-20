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
CommuteDao.prototype.selectCommuteByID = function(data){
    var queryStr = db.getQuery('commute', 'selectCommuteByID');
    debug(queryStr);
    return db.queryV2(queryStr, [data.startDate, data.endDate, data.id]);
}

// 툴퇴근 수정 
CommuteDao.prototype.updateCommuteResultInOutTime =  function (data) {
	var queryStr = db.getQuery('commute', 'updateCommuteResultInOutTime');
    debug(queryStr);
    return db.queryV2(queryStr, [data.in_time, data.in_time_change, data.out_time, data.out_time_change, data.id, data.date]);
}

CommuteDao.prototype.insertCommute =  function (data) {
	var queryStr = db.getQuery('commute', 'insetCommuteResult');
    debug(queryStr);
    return db.queryV2(
        queryStr, 
        [
            data.date, data.department, data.id, data.in_time, data.late_time, data.name, data.out_office_code,
    		data.out_time, data.over_time, data.overtime_code, data.vacation_code, data.standard_in_time,
    		data.standard_out_time, data.work_type, data.year,
    		data.in_time_type, data.out_time_type, data.out_office_start_time, data.out_office_end_time,
            
            data.department, data.in_time, data.late_time, data.name, data.out_office_code, data.out_time, data.over_time, data.overtime_code,
			data.vacation_code,	data.standard_in_time,	data.standard_out_time,	data.work_type,	data.in_time_type,	data.out_time_type,
			data.out_office_start_time,	data.out_office_end_time
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

CommuteDao.prototype.getLastiestDate = function(){
    var queryStr = db.getQuery('commute', 'getLastiestDate');
    return db.queryV2(queryStr);
}
module.exports = new CommuteDao();