// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var db = require('../lib/dbmanager.js');
var group = "code";

var CodeDao = function () {
};

CodeDao.prototype.selectDeptList =  function () {
    return db.query(group, "selectDeptList");
};

CodeDao.prototype.selectPartList =  function () {
    return db.query(group, "selectPartList");
};

CodeDao.prototype.selectApprovalUserList =  function () {
    return db.query(group, "selectApprovalUserList");
};

CodeDao.prototype.selectPositionList =  function () {
    return db.query(group, "selectPositionList");
};

CodeDao.prototype.getOfficeCode =  function () {
    return db.query(group, "getOfficeCode");
};

CodeDao.prototype.getOvertimeCode =  function () {
    return db.query(group, "getOvertimeCode");
};

CodeDao.prototype.getWorktypeCode =  function () {
    return db.query(group, "getWorktypeCode");
};
module.exports = new CodeDao();