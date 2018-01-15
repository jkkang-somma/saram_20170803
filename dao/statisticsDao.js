var db = require('../lib/dbmanager.js');
var group = 'statistics';

var StatisticsDao = function () {
    
};

StatisticsDao.prototype.selectPageUrlCount =  function (url) {
    return db.query(group, "selectPageUrlCount", [url]);
};

StatisticsDao.prototype.updatePageUrlCount =  function (url, count) {
    return db.query(group, "updatePageUrlCount", [url, count, url, count]);
};

StatisticsDao.prototype.selectAbnormalDeptSummary =  function (yearMonth) {
    return db.query(group, "selectAbnormalDeptSummary", [yearMonth]);
};

StatisticsDao.prototype.selectDeptPersonCount =  function (yearMonth) {
    return db.query(group, "selectDeptPersonCount", [yearMonth]);
};

StatisticsDao.prototype.selectDeptDetail =  function (yearMonth, dept, workType) {
    return db.query(group, "selectDeptDetail", [yearMonth, dept, workType]);
};


module.exports = new StatisticsDao();
