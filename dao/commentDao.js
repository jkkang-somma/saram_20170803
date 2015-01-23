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

//comment 조회  
CommentDao.prototype.selectCommentById =  function (data) {
	var queryStr = db.getQuery('comment', 'selectCommentById');
    debug(queryStr);
    return db.queryV2(queryStr, [data.startDate, data.endDate, data.id]);
}

//comment 조회  
CommentDao.prototype.selectCommentByPk =  function (data) {
	var queryStr = db.getQuery('comment', 'selectCommentByPk');
    debug(queryStr);
    return db.queryV2(queryStr, [data.id, data.date, data.seq]);
}

// comment 등록 
CommentDao.prototype.insertComment =  function (data) {
	var queryStr = db.getQuery('comment', 'insertComment');
    debug(queryStr);
    return db.queryV2(queryStr, [data.year, data.id, data.date, data.comment, data.state, data.writer_id, 
                                 data.want_in_time, data.want_out_time, data.before_in_time, data.before_out_time]);
}

// comment reply 수정 
CommentDao.prototype.updateCommentReply =  function (data) {
	var queryStr = db.getQuery('comment', 'updateCommentReply');
    debug(queryStr);
    return db.queryV2(queryStr, [data.comment_reply, data.state, data.reply_id, data.id, data.year, data.date, data.seq]);
}

module.exports = new CommentDao();