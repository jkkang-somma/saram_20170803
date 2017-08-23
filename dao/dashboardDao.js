// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.22

var db = require('../lib/dbmanager.js');

var DashboardDao = function () {
};

DashboardDao.prototype.selectWorkingSummaryById =  function (params) {
    return db.query('dashboard', 'selectWorkingSummaryById', [params.start, params.end, params.userId]);
};

DashboardDao.prototype.selectCommuteSummaryById = function (params) {
    return db.query('dashboard', 'selectCommuteSummaryById', [params.userId, params.start, params.end]);
};

DashboardDao.prototype.selectAttendanceById = function (params) {
    return db.query('dashboard', 'selectAttendanceById', [params.userId, params.start, params.end]);
};
 
module.exports = new DashboardDao();