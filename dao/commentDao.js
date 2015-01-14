var debug = require('debug')('CommentDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CommentDao = function () {
}

// 근태자료관리 조회 
CommentDao.prototype.selectComment =  function (data) {
	var queryStr = db.getQuery('comment', 'selectComment');
    debug(queryStr);
    return db.queryV2(queryStr, [data.startDate, data.endDate]);
}

// 툴퇴근 수정 
CommentDao.prototype.insertComment =  function (data) {
	var queryStr = db.getQuery('comment', 'insertComment');
    debug(queryStr);
    return db.queryV2(queryStr, [data.year, data.id, data.date, data.comment, data.state]);
}

module.exports = new CommentDao();