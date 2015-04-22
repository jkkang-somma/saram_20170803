// Author: sanghee park <novles@naver.com>
// Create Date: 2014.1.22

var db = require('../lib/dbmanager.js');

var DashboardDao = function () {
};

DashboardDao.prototype.selectWorkingSummaryById =  function (params) {
    return db.query('dashboard', 'selectWorkingSummaryById', [params.start, params.end, params.userId]);
};
module.exports = new DashboardDao();