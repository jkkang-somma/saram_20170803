// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.12
// code table access 

var debug = require('debug')('codeDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CodeDao = function () {
};
CodeDao.prototype.selectDeptList =  function () {
    var queryStr = db.getQuery('code', 'selectDeptList');
    return db.queryV2(queryStr);
};
CodeDao.prototype.selectApprovalUserList =  function () {
    var queryStr = db.getQuery('code', 'selectApprovalUserList');
    return db.queryV2(queryStr);
};
CodeDao.prototype.selectPositionList =  function () {
    var queryStr = db.getQuery('code', 'selectPositionList');
    return db.queryV2(queryStr);
};
module.exports = new CodeDao();