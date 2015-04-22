var db = require('../lib/dbmanager.js');
var group = "comment";

var CommentDao = function () {
};

// comment 조회  
CommentDao.prototype.selectComment =  function (data) {
    return db.query(group, "selectComment", [data.startDate, data.endDate]);
};

//comment 조회  
CommentDao.prototype.selectCommentById =  function (data) {
    return db.query(group, "selectCommentById", [data.startDate, data.endDate, data.id]);
};

//comment 조회  
CommentDao.prototype.selectCommentByPk =  function (data) {
    return db.query(group, "selectCommentByPk", [data.id, data.date, data.seq]);
};

// comment 등록 
CommentDao.prototype.insertComment =  function (data) {
    return db.query(group, "insertComment", 
        [ data.year, data.id, data.date, data.comment, data.state, data.writer_id, 
        data.want_in_time, data.want_out_time, data.before_in_time, data.before_out_time ]
    );
};

// comment reply 수정 
CommentDao.prototype.updateCommentReply =  function (data) {
    return db.query(group, "updateCommentReply",
        [data.comment_reply, data.state, data.reply_id, data.id, data.year, data.date, data.seq]
    );
};

module.exports = new CommentDao();