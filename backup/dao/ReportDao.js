var db = require('../lib/dbmanager.js');
var group = "report";

var ReportDao = function () {
};

// 레포트 유저 리스트 
ReportDao.prototype.selectReportUsers =  function () {
    return db.query(group, "selectReportUsers");
};

// 지각 현황
ReportDao.prototype.selectLateWorkerReport =  function (selObj) {
    return db.query(group, "selectLateWorkerReport", [selObj.year, selObj.startTime, selObj.endTime]);
};

// 연차 사용 현황
ReportDao.prototype.selectUsedHolidayReport =  function (selObj) {
    return db.query(group, "selectUsedHolidayReport", [selObj.startTime, selObj.endTime, selObj.year]);
};

// 잔업시간(분) 현황 ( 평일 잔업시간 )	
ReportDao.prototype.selectOverTimeWorkeReport =  function (selObj) {
    return db.query(group, "selectOverTimeWorkeReport", [selObj.year, selObj.startTime, selObj.endTime]);
};

// 잔업 수당 타입 현황	
ReportDao.prototype.selectOverTimeWorkTypeReport =  function (selObj) {
    return db.query(group, "selectOverTimeWorkTypeReport", 
        [selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime]
    );
};

// 잔업 수당 금액 현황	
ReportDao.prototype.selectOverTimeWorkPayReport =  function (selObj) {
    return db.query(group, "selectOverTimeWorkPayReport", [selObj.year, selObj.startTime, selObj.endTime]);
};

// 휴일 근무 타입 현황
ReportDao.prototype.selectHolidayWorkTypeReport =  function (selObj) {
    return db.query(group, "selectHolidayWorkTypeReport", 
        [selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime, selObj.year, selObj.startTime, selObj.endTime]
    );
};

// 휴일근무 수당 금액 현황		
ReportDao.prototype.selectHolidayWorkPayReport =  function (selObj) {
    return db.query(group, "selectHolidayWorkPayReport", [selObj.year, selObj.startTime, selObj.endTime]);
};


// commute_result_tbl 테이블 	
ReportDao.prototype.selectReportCommuteResultTbl =  function (selObj) {
    return db.query(group, "selectReportCommuteResultTbl", [selObj.year, selObj.startTime, selObj.endTime]);
};


module.exports = new ReportDao();