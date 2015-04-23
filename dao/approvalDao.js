// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var db = require('../lib/dbmanager.js');
var group = "approval";

var ApprovalDao = function () {
};

ApprovalDao.prototype.selectApprovalList =  function (doc_num) {
    return db.query(group, "selectApprovalList", [doc_num]);
};

ApprovalDao.prototype.selectApprovalListWhere =  function (startDate, endDate) {
    return db.query(group, "selectApprovalListWhere", [startDate, endDate,startDate,endDate]);
};

ApprovalDao.prototype.selectApprovalByManager =  function (manager_id, startDate, endDate) {
    return db.query(group, "selectApprovalByManager", [manager_id,startDate,endDate,startDate,endDate]);
};

ApprovalDao.prototype.insertApproval =  function (data) {
    return db.query(group, "insertApproval",
        [ data.doc_num,data.submit_id,data.manager_id
        ,data.submit_comment,data.start_date,data.end_date
        ,data.office_code,data.start_time,data.end_time,data.day_count ]
    );
};

ApprovalDao.prototype.updateApprovalConfirm =  function (connection, data) {
    return db.queryTransaction(
        connection,
        group, "updateApprovalConfirm",
        data,
        [
            "decide_comment", "state", "black_mark", "doc_num"
        ]
    ); 
};

ApprovalDao.prototype.selectApprovalListById =  function (data) {
    return db.query(group, "selectApprovalListById", [data.id, data.year]);
};

ApprovalDao.prototype.getApprovalMailData =  function (doc_num) {
    return db.query(group, "getApprovalMailData", [doc_num]);
};

ApprovalDao.prototype.getApprovalMailingList =  function (dept_code) {
    return db.query(group, "getApprovalMailingList", [dept_code]);
};

ApprovalDao.prototype.selectApprovalIndex =  function (yearmonth) {
    return db.query("approval_idex", "selectMaxIndexApproval", [yearmonth]);
};

ApprovalDao.prototype.insertApprovalIndex =  function (data) {
    return db.query("approval_idex", "insertApprovalIndex", [data.yearmonth]);
};

ApprovalDao.prototype.updateMaxIndex =  function (data) {
    return db.query("approval_idex", "updateMaxIndex", [data.yearmonth]);
};

module.exports = new ApprovalDao();