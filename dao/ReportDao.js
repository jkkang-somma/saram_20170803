var debug = require('debug')('ReportDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var ReportDao = function () {
}

// 지각 현황
ReportDao.prototype.selectLateWorkerReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectLateWorkerReport');
    return db.queryV2(queryStr, [year]);
}

// 연차 사용 현황
ReportDao.prototype.selectUsedHolidayReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectUsedHolidayReport');
    return db.queryV2(queryStr, [year]);
}

// 잔업시간(분) 현황 ( 평일 잔업시간 )	
ReportDao.prototype.selectOverTimeWorkeReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkeReport');
    return db.queryV2(queryStr, [year]);
}

// 잔업 수당 타입 현황	
ReportDao.prototype.selectOverTimeWorkTypeReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkTypeReport');
    return db.queryV2(queryStr, [year, year, year]);
}

// 잔업 수당 금액 현황	
ReportDao.prototype.selectOverTimeWorkPayReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkPayReport');
    return db.queryV2(queryStr, [year]);
}

// 휴일 근무 타입 현황
ReportDao.prototype.selectHolidayWorkTypeReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectHolidayWorkTypeReport');
    return db.queryV2(queryStr, [year, year, year]);
}

// 휴일근무 수당 금액 현황		
ReportDao.prototype.selectHolidayWorkPayReport =  function (year) {
    var queryStr = db.getQuery('report', 'selectHolidayWorkPayReport');
    return db.queryV2(queryStr, [year]);
}

module.exports = new ReportDao();