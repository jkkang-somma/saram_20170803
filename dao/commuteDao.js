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

module.exports = new CommuteDao();