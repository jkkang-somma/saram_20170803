// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var debug = require('debug')('approvalDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var ApprovalDao = function () {
};
ApprovalDao.prototype.selectApprovalList =  function () {
    var queryStr = db.getQuery('approval', 'selectApprovalList');
    return db.queryV2(queryStr);
};
ApprovalDao.prototype.selectApprovalListWhere =  function (startDate, endDate) {
    var queryStr = db.getQuery('approval', 'selectApprovalListWhere');
    return db.queryV2(queryStr, [startDate,endDate,startDate,endDate]);
};
ApprovalDao.prototype.insertApproval =  function (data) {
    var queryStr = db.getQuery('approval', 'insertApproval');
    return db.queryV2(queryStr, [data.doc_num,data.submit_id,data.manager_id,data.submit_comment,data.start_date,data.end_date,data.office_code,data.state]);
};
ApprovalDao.prototype.updateApprovalConfirm =  function (data) {
    var queryStr = db.getQuery('approval', 'updateApprovalConfirm');
    return db.queryV2(queryStr, [data.decide_comment, data.state, data.doc_num]);
};
ApprovalDao.prototype.selectApprovalIndex =  function (yearmonth) {
    var queryStr = db.getQuery('approval_index', 'selectMaxIndexApproval');
    return db.queryV2(queryStr, [yearmonth]);
};
ApprovalDao.prototype.insertApprovalIndex =  function (data) {
    var queryStr = db.getQuery('approval_index', 'insertApprovalIndex');
    return db.queryV2(queryStr, [data.yearmonth]);
};
ApprovalDao.prototype.updateMaxIndex =  function (data) {
    var queryStr = db.getQuery('approval_index', 'updateMaxIndex');
    return db.queryV2(queryStr, [data.yearmonth]);
};
module.exports = new ApprovalDao();