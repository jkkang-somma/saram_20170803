var db = require('../lib/dbmanager.js');
var _ = require('underscore');
var group = "officeItemHistory";

var officeItemHistoryDao = function () {
};

officeItemHistoryDao.prototype.selectOfficeItemHistoryList = function (data) {
    if(_.isUndefined(data.type) || data.type == "전체")
        return db.query(group, 'selectOfficeItemHistoryListAll', [data.start, data.end]);
    else if(_.isUndefined(data.code) || data.code == "전체")
        return db.query(group, 'selectOfficeItemHistoryListAllV2', [data.start, data.end, data.type]);
    else
        return db.query(group, 'selectOfficeItemHistoryList', [data.start, data.end, data.type, data.code]);
};

officeItemHistoryDao.prototype.selectOfficeItemHistoryListV2 = function (data) {
    return db.query(group, "selectOfficeItemHistoryListV2", [data.serial_yes]);
};

officeItemHistoryDao.prototype.insertOfficeItemHistory = function(officeitem){
    return new Promise(function(resolve) {
        resolve(db.query(group, "insertOfficeItemHistory",
        [officeitem.serial_yes,officeitem.category_type,officeitem.type,officeitem.title,officeitem.repair_price,officeitem.use_user,officeitem.use_dept,officeitem.name,officeitem.change_user_id,officeitem.memo]));
    });
};

officeItemHistoryDao.prototype.deleteOfficeItemHistory = function(id){
    return db.query(group, "deleteOfficeItemHistory",[id]);
};

module.exports = new officeItemHistoryDao();