var db = require('../lib/dbmanager.js');
var group = "changeHistory";

var ChangeHistoryDao = function (){
};

// 변경 이력 조회 
ChangeHistoryDao.prototype.selectChangeHistory =  function (data) {
    return db.query(group, "selectChangeHistory", [data.id, data.date, data.change_column, data.change_memo]);
};

//퇴퇴근 변경 이력 조회 
ChangeHistoryDao.prototype.selectInOutChangeCount =  function (data) {
    return db.query(group, "selectInOutChangeCount", [data.year, data.id, data.date, data.year, data.id, data.date]);
};

//변경 이력 등록
ChangeHistoryDao.prototype.inserChangeHistory =  function (data) {
    return {
        group : group,
        item : "inserChangeHistory",
        data : [data.year, data.id,  data.date,  data.change_column, data.change_before, data.change_after, data.change_id, data.change_memo],
    };
};

module.exports = new ChangeHistoryDao();