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
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime]);
}

// 연차 사용 현황
ReportDao.prototype.selectUsedHolidayReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectUsedHolidayReport');
    return db.queryV2(queryStr, [selObj.startTime, selObj.endTime, selObj.year]);
}

// 잔업시간(분) 현황 ( 평일 잔업시간 )	
ReportDao.prototype.selectOverTimeWorkeReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkeReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime]);
}

// 잔업 수당 타입 현황	
ReportDao.prototype.selectOverTimeWorkTypeReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkTypeReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime]);
}

// 잔업 수당 금액 현황	
ReportDao.prototype.selectOverTimeWorkPayReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectOverTimeWorkPayReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime]);
}

// 휴일 근무 타입 현황
ReportDao.prototype.selectHolidayWorkTypeReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectHolidayWorkTypeReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime]);
}

// 휴일근무 수당 금액 현황		
ReportDao.prototype.selectHolidayWorkPayReport =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectHolidayWorkPayReport');
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime]);
}


// commute_result_tbl 테이블 	
ReportDao.prototype.selectReportCommuteResultTbl =  function (selObj) {
    var queryStr = db.getQuery('report', 'selectReportCommuteResultTbl');
    return db.queryV2(queryStr, [selObj.year, selObj.startTime, selObj.endTime]);
}


module.exports = new ReportDao();