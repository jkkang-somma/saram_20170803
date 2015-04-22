var debug = require('debug')('CommuteDao');
var db = require('../lib/dbmanager.js');

var CommuteDao = function () {
}

// 근태자료관리 조회 
CommuteDao.prototype.selectCommute =  function (data) {
    if(data.dept == "전체"){
        return db.queryV2(db.getQuery('commute', 'selectCommuteAll'), [data.startDate, data.endDate]);    
    }else{
        return db.queryV2(db.getQuery('commute', 'selectCommute'), [data.startDate, data.endDate, data.dept]);    
    }
}
CommuteDao.prototype.selectCommuteByID = function(data){
    var queryStr = db.getQuery('commute', 'selectCommuteByID');
    return db.queryV2(queryStr, [data.startDate, data.endDate, data.id]);
}

// 툴퇴근 수정 
CommuteDao.prototype.updateCommuteResultInOutTime =  function (data) {
	var queryStr = db.getQuery('commute', 'updateCommuteResultInOutTime');
    return db.queryV2(queryStr, [data.in_time, data.in_time_change, data.out_time, data.out_time_change, data.id, data.date]);
}

CommuteDao.prototype.insertCommute = function(connection, data){
    var queryStr = db.getQuery('commute', 'insertCommuteResult');
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "date", "department", "id", "in_time", "late_time", "name",
            "out_office_code", "out_time", "over_time", "overtime_code",
            "vacation_code", "standard_in_time", "standard_out_time", "work_type",
            "year",	"in_time_type", "out_time_type", "out_office_start_time",
            "out_office_end_time", "in_time_change", "out_time_change",
            "early_time", "not_pay_over_time"
        ]
    ); 
}

CommuteDao.prototype.updateCommute_t = function(connection, data){
    var queryStr = db.getQuery('commute', 'updateCommuteResult');
    return db.queryTransaction(
        connection,
        queryStr,
        data,
        [
            "in_time", "late_time", "out_office_code", "out_time","over_time", 
            "overtime_code", "vacation_code", "standard_in_time","standard_out_time", 
            "work_type", "in_time_type", "out_time_type", "out_office_start_time",
            "out_office_end_time", "in_time_change", "out_time_change", "overtime_code_change",
            "early_time", "not_pay_over_time", "id", "date"
        ]
    ); 
}

CommuteDao.prototype.selectCommuteDate = function(date) {
	var queryStr = db.getQuery('commute', 'selectCommuteDate');
    return db.queryV2(queryStr, [date]);
}

// comment 갯수 수정 
CommuteDao.prototype.updateCommuteCommentCount =  function (data) {
	var queryStr = db.getQuery('commute', 'updateCommuteCommentCount');
    return db.queryV2(queryStr, [data.id, data.year, data.date, data.id, data.year, data.date]);
}

CommuteDao.prototype.getLastiestDate = function(){
    var queryStr = db.getQuery('commute', 'getLastiestDate');
    return db.queryV2(queryStr);
}
module.exports = new CommuteDao();