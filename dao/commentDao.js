var debug = require('debug')('CommentDao');
var util = require('util');
var db = require('../lib/dbmanager.js');

var CommentDao = function () {
}

// comment 조회  
CommentDao.prototype.selectComment =  function (data) {
	var queryStr = db.getQuery('comment', 'selectComment');
    debug(queryStr);
    return db.queryV2(queryStr, [data.startDate, data.endDate]);
}

// comment 등록 
CommentDao.prototype.insertComment =  function (data) {
	var queryStr = db.getQuery('comment', 'insertComment');
    debug(queryStr);
    return db.queryV2(queryStr, [data.year, data.id, data.date, data.comment, data.state]);
}

// comment reply 수정 
CommentDao.prototype.updateCommentReply =  function (data) {
	var queryStr = db.getQuery('comment', 'updateCommentReply');
    debug(queryStr);
    return db.queryV2(queryStr, [data.comment_reply, data.state, data.id, data.year, data.date]);
}

module.exports = new CommentDao();