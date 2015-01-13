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

ApprovalDao.prototype.selectOfficeCodeList =  function () {
    var queryStr = db.getQuery('approval', 'selectOfficeCodeList');
    return db.queryV2(queryStr);
};
module.exports = new ApprovalDao();