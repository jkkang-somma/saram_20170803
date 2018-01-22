var db = require('../lib/dbmanager.js');
var _ = require('underscore');
var group = "usage";

var OfficeItemUsageDao = function () {
};

OfficeItemUsageDao.prototype.selectUsageDetailList = function(data){
    if (_.isUndefined(data) || data.user == "Excel") {
        return db.query(group, "selectUsageDetailListAll");
    } else {
        return db.query(group, "selectUsageDetailList", [data.user]);
    }
};

OfficeItemUsageDao.prototype.selectUsageList = function(data) {
    if(data.admin != "9") {
        return db.query(group, 'selectUsageListbyUser', [data.user])
    }

    if(_.isUndefined(data.dept) || data.dept == "전체") {
        return db.query(group, 'selectUsageListALL');
    } else {
        return db.query(group, 'selectUsageList', [data.dept]);
    }
};

module.exports = new OfficeItemUsageDao();