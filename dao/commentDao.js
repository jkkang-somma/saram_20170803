var db = require('../lib/dbmanager.js');
var group = "comment";

var CommentDao = function () {
};

// comment 조회  
CommentDao.prototype.selectComment =  function (data, id) {
    return db.query(group, "selectComment", [data.startDate, data.endDate, id]);
};

// 결재를 해야할 코멘트 건수
CommentDao.prototype.selectCommentCountToManager =  function (id) {
    return db.query(group, "selectCommentCountToManager", [id]);
};

//comment 조회 - 요청자(결재자)를 기준으로 모든 '상신' 건을 조회함.
CommentDao.prototype.selectCommentById =  function (id) {
    return db.query(group, "selectCommentById", [id]);
};

//comment 조회  
CommentDao.prototype.selectCommentByPk =  function (data) {
    return db.query(group, "selectCommentByPk", [data.id, data.date, data.seq]);
};

// comment 등록 
CommentDao.prototype.insertComment =  function (data) {
    return db.query(group, "insertComment", 
        [ data.year, data.id, data.date, data.comment, data.state, data.writer_id, 
        data.want_in_time, data.want_out_time, data.before_in_time, data.before_out_time, data.want_normal, data.approval_id, data.approval_name ]
    );
};

// comment reply 수정 
CommentDao.prototype.updateCommentReply =  function (data) {
    return db.query(group, "updateCommentReply",
        [data.comment_reply, data.state, data.reply_id, data.id, data.year, data.date, data.seq]
    );
};

// 현재 처리중인 코멘트가 있는지 체크
CommentDao.prototype.selectCommentExist =  function (data) {
  return db.query(group, "selectCommentExist",
      [data.id, data.year, data.date]
  );
};


module.exports = new CommentDao();