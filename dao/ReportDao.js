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

// 잔업시간(분) 현황 ( 평일 잔업시간 )	- 야근상신된 항목만 야근시간으로 계산
ReportDao.prototype.selectPayedOverTimeWorkReport =  function (selObj) {
    return db.query(group, "selectPayedOverTimeWorkReport", [selObj.year, selObj.startTime, selObj.endTime]);
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

// 휴일 근무 시간
ReportDao.prototype.selectHolidayWorkTimeReport =  function (selObj) {
    return db.query(group, "selectHolidayWorkTimeReport", [selObj.year, selObj.startTime, selObj.endTime]);
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

// 잔업시간(분) 현황 ( 평일 잔업시간 )	
ReportDao.prototype.selectOverTimeWorkeReport25 =  function (selObj) {
    var preYear = selObj.year - 1;
    var year = selObj.year;
    
	var param = [];
	
	param.push(preYear+"-12-26");  param.push(year+"-01-25");
    param.push(year+"-01-26");     param.push(year+"-02-25");
    param.push(year+"-02-26");     param.push(year+"-03-25");
    param.push(year+"-03-26");     param.push(year+"-04-25");
    param.push(year+"-04-26");     param.push(year+"-05-25");
    param.push(year+"-05-26");     param.push(year+"-06-25");
    param.push(year+"-06-26");     param.push(year+"-07-25");
    param.push(year+"-07-26");     param.push(year+"-08-25");
    param.push(year+"-08-26");     param.push(year+"-09-25");
    param.push(year+"-09-26");     param.push(year+"-10-25");
    param.push(year+"-10-26");     param.push(year+"-11-25");
    param.push(year+"-11-26");     param.push(year+"-12-25");
    
    param.push(preYear+"-12-26");  param.push(year+"-12-25");
    
    return db.query(group, "selectOverTimeWorkeReport25", param);
};

// 잔업 수당 타입 현황	
ReportDao.prototype.selectOverTimeWorkTypeReport25 =  function (selObj) {
    var preYear = selObj.year - 1;
    var year = selObj.year;
    
    var param = [];
    
    for ( i = 0 ; i < 3 ; i++ )
    {
	    param.push(preYear+"-12-26");  param.push(year+"-01-25");
	    param.push(year+"-01-26");     param.push(year+"-02-25");
	    param.push(year+"-02-26");     param.push(year+"-03-25");
	    param.push(year+"-03-26");     param.push(year+"-04-25");
	    param.push(year+"-04-26");     param.push(year+"-05-25");
	    param.push(year+"-05-26");     param.push(year+"-06-25");
	    param.push(year+"-06-26");     param.push(year+"-07-25");
	    param.push(year+"-07-26");     param.push(year+"-08-25");
	    param.push(year+"-08-26");     param.push(year+"-09-25");
	    param.push(year+"-09-26");     param.push(year+"-10-25");
	    param.push(year+"-10-26");     param.push(year+"-11-25");
	    param.push(year+"-11-26");     param.push(year+"-12-25");
	    
	    param.push(preYear+"-12-26");  param.push(year+"-12-25");
	}
    
    return db.query(group, "selectOverTimeWorkTypeReport25", param);
};

// 잔업 수당 금액 현황	
ReportDao.prototype.selectOverTimeWorkPayReport25 =  function (selObj) {
    var preYear = selObj.year - 1;
    var year = selObj.year;
    
	var param = [];
	
	param.push(preYear+"-12-26");  param.push(year+"-01-25");
    param.push(year+"-01-26");     param.push(year+"-02-25");
    param.push(year+"-02-26");     param.push(year+"-03-25");
    param.push(year+"-03-26");     param.push(year+"-04-25");
    param.push(year+"-04-26");     param.push(year+"-05-25");
    param.push(year+"-05-26");     param.push(year+"-06-25");
    param.push(year+"-06-26");     param.push(year+"-07-25");
    param.push(year+"-07-26");     param.push(year+"-08-25");
    param.push(year+"-08-26");     param.push(year+"-09-25");
    param.push(year+"-09-26");     param.push(year+"-10-25");
    param.push(year+"-10-26");     param.push(year+"-11-25");
    param.push(year+"-11-26");     param.push(year+"-12-25");
    
    param.push(preYear+"-12-26");  param.push(year+"-12-25");
    
    return db.query(group, "selectOverTimeWorkPayReport25", param);
};

module.exports = new ReportDao();