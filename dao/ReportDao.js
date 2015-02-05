var debug = require('debug')('ReportDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var ReportDao = function () {
}

// 레포트 유저 리스트 
ReportDao.prototype.selectReportUsers =  function () {
    var queryStr = db.getQuery('report', 'selectReportUsers');
    return db.queryV2(queryStr, []);
}

// 지각 현황
ReportDao.prototype.selectLateWorkerReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectLateWorkerReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startDate, selObj.endDate]);
}

// 연차 사용 현황
ReportDao.prototype.selectUsedHolidayReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectUsedHolidayReport');
    return db.queryV2(queryStr, [selObj.startDate, selObj.endDate, selObj.year]);
}

// 잔업시간(분) 현황 ( 평일 잔업시간 )	
ReportDao.prototype.selectOverTimeWorkeReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkeReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startDate, selObj.endDate]);
}

// 잔업 수당 타입 현황	
ReportDao.prototype.selectOverTimeWorkTypeReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkTypeReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startDate, selObj.endDate, selObj.year, selObj.startDate, selObj.endDate, selObj.year, selObj.startDate, selObj.endDate]);
}

// 잔업 수당 금액 현황	
ReportDao.prototype.selectOverTimeWorkPayReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkPayReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startDate, selObj.endDate]);
}

// 휴일 근무 타입 현황
ReportDao.prototype.selectHolidayWorkTypeReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectHolidayWorkTypeReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startDate, selObj.endDate, selObj.year, selObj.startDate, selObj.endDate, selObj.year, selObj.startDate, selObj.endDate]);
}

// 휴일근무 수당 금액 현황		
ReportDao.prototype.selectHolidayWorkPayReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectHolidayWorkPayReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startDate, selObj.endDate]);
}

module.exports = new ReportDao();